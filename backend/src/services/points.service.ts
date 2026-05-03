import { prisma } from "../database/db.js";
import type { PointAction } from "@prisma/client";

// ─── Level config ──────────────────────────────────────────────────────────────

export const LEVELS = [
  { level: 1, minXP: 0 },
  { level: 2, minXP: 50 },
  { level: 3, minXP: 150 },
  { level: 4, minXP: 300 },
  { level: 5, minXP: 500 },
  { level: 6, minXP: 750 },
  { level: 7, minXP: 1100 },
  { level: 8, minXP: 1600 },
  { level: 9, minXP: 2200 },
];

export const POINT_VALUES: Record<PointAction, number> = {
  MEMBERSHIP_JOINED: 5,
  POST_CREATED: 5,
  COMMENT_CREATED: 2,
  LESSON_COMPLETED: 10,
};

export function computeLevel(totalXP: number): { level: number; pointsToNextLevel: number | null } {
  let currentLevel = LEVELS[0]!;
  for (const l of LEVELS) {
    if (totalXP >= l.minXP) currentLevel = l;
  }
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  return {
    level: currentLevel.level,
    pointsToNextLevel: nextLevel ? nextLevel.minXP - totalXP : null,
  };
}

// ─── Add points ────────────────────────────────────────────────────────────────

export async function addPoints(userId: string, communityId: string, action: PointAction) {
  const points = POINT_VALUES[action];
  return prisma.userPoints.create({ data: { userId, communityId, action, points } });
}

// ─── Get user stats for a community ───────────────────────────────────────────

export async function getUserStats(userId: string, communityId: string) {
  const result = await prisma.userPoints.aggregate({
    where: { userId, communityId },
    _sum: { points: true },
  });
  const totalXP = result._sum.points ?? 0;
  return { totalXP, ...computeLevel(totalXP) };
}

// ─── Build a leaderboard for a time window ────────────────────────────────────

async function buildLeaderboard(communityId: string, since: Date | null, limit = 20) {
  const where = { communityId, ...(since ? { createdAt: { gte: since } } : {}) };

  const grouped = await prisma.userPoints.groupBy({
    by: ["userId"],
    where,
    _sum: { points: true },
    orderBy: { _sum: { points: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return [];

  const userIds = grouped.map((g) => g.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstname: true, lastname: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return grouped.map((g, i) => ({
    rank: i + 1,
    userId: g.userId,
    firstname: userMap.get(g.userId)?.firstname ?? "",
    lastname: userMap.get(g.userId)?.lastname ?? "",
    points: g._sum.points ?? 0,
  }));
}

// ─── Level distribution across all members ────────────────────────────────────

async function getLevelDistribution(communityId: string) {
  // Aggregate total XP per member in this community
  const memberXP = await prisma.userPoints.groupBy({
    by: ["userId"],
    where: { communityId },
    _sum: { points: true },
  });

  // Count all memberships to compute percentages
  const totalMembers = await prisma.membership.count({ where: { communityId } });
  if (totalMembers === 0) return LEVELS.map((l) => ({ ...l, count: 0, percentage: 0 }));

  const levelCounts: Record<number, number> = {};
  LEVELS.forEach((l) => (levelCounts[l.level] = 0));

  for (const m of memberXP) {
    const xp = m._sum.points ?? 0;
    const { level } = computeLevel(xp);
    levelCounts[level] = (levelCounts[level] ?? 0) + 1;
  }

  // Members with zero points are Level 1
  const membersWithPoints = memberXP.length;
  levelCounts[1] = (levelCounts[1] ?? 0) + (totalMembers - membersWithPoints);

  return LEVELS.map((l) => ({
    level: l.level,
    minXP: l.minXP,
    count: levelCounts[l.level] ?? 0,
    percentage: Math.round(((levelCounts[l.level] ?? 0) / totalMembers) * 100),
  }));
}

// ─── Full leaderboard response ────────────────────────────────────────────────

export async function getLeaderboard(communityId: string, userId: string) {
  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [userStats, levelDistribution, board7d, board30d, boardAllTime] = await Promise.all([
    getUserStats(userId, communityId),
    getLevelDistribution(communityId),
    buildLeaderboard(communityId, since7d),
    buildLeaderboard(communityId, since30d),
    buildLeaderboard(communityId, null),
  ]);

  return {
    userStats,
    levelDistribution,
    leaderboard7d: board7d,
    leaderboard30d: board30d,
    leaderboardAllTime: boardAllTime,
    lastUpdated: now.toISOString(),
  };
}
