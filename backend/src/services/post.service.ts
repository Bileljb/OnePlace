import { prisma } from "../database/db.js";
import { AppError } from "../utils/AppError.js";
import type { PostType } from "@prisma/client";

// ─── Create Post ───────────────────────────────────────────────────────────────
// Any active member can post.

export async function createPost(
  communityId: string,
  authorId: string,
  input: { title: string; content: string; type?: PostType; category?: string }
) {
  if (!input.title?.trim()) throw new AppError("title is required", 400);
  if (!input.content?.trim()) throw new AppError("content is required", 400);

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community) throw new AppError("Community not found", 404);

  const membership = await prisma.membership.findUnique({
    where: { userId_communityId: { userId: authorId, communityId } },
  });

  if (!membership || membership.status !== "ACTIVE") {
    throw new AppError("You must be an active member to post", 403);
  }

  return prisma.post.create({
    data: {
      communityId,
      authorId,
      title: input.title.trim(),
      content: input.content.trim(),
      type: input.type ?? "TEXT",
      category: input.category?.trim() ?? null,
    },
    include: {
      author: { select: { id: true, firstname: true, lastname: true } },
    },
  });
}

// ─── Get Post By ID ────────────────────────────────────────────────────────────

export async function getPostById(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, firstname: true, lastname: true } },
      _count: { select: { comments: true } },
    },
  });

  if (!post) throw new AppError("Post not found", 404);
  return post;
}

// ─── Delete Post ───────────────────────────────────────────────────────────────
// Author, community creator, or community admin may delete.

export async function deletePost(postId: string, requesterId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { community: { select: { creatorId: true } } },
  });

  if (!post) throw new AppError("Post not found", 404);

  const isAuthor = post.authorId === requesterId;

  if (!isAuthor) {
    const membership = await prisma.membership.findUnique({
      where: { userId_communityId: { userId: requesterId, communityId: post.communityId } },
    });
    const canModerate = membership && ["creator", "admin"].includes(membership.role);
    if (!canModerate) {
      throw new AppError("You do not have permission to delete this post", 403);
    }
  }

  await prisma.post.delete({ where: { id: postId } });
}

// ─── Create Comment ────────────────────────────────────────────────────────────

export async function createComment(
  postId: string,
  authorId: string,
  content: string
) {
  if (!content?.trim()) throw new AppError("content is required", 400);

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  // Caller must be an active member of the community the post belongs to
  const membership = await prisma.membership.findUnique({
    where: { userId_communityId: { userId: authorId, communityId: post.communityId } },
  });

  if (!membership || membership.status !== "ACTIVE") {
    throw new AppError("You must be an active member to comment", 403);
  }

  return prisma.comment.create({
    data: { postId, authorId, content: content.trim() },
    include: {
      author: { select: { id: true, firstname: true, lastname: true } },
    },
  });
}

// ─── Get Post Comments ─────────────────────────────────────────────────────────

export async function getPostComments(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, firstname: true, lastname: true } },
    },
  });
}

// ─── Delete Comment ────────────────────────────────────────────────────────────
// Author, community creator, or community admin may delete.

export async function deleteComment(commentId: string, requesterId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { communityId: true } } },
  });

  if (!comment) throw new AppError("Comment not found", 404);

  const isAuthor = comment.authorId === requesterId;

  if (!isAuthor) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_communityId: { userId: requesterId, communityId: comment.post.communityId },
      },
    });
    const canModerate = membership && ["creator", "admin"].includes(membership.role);
    if (!canModerate) {
      throw new AppError("You do not have permission to delete this comment", 403);
    }
  }

  await prisma.comment.delete({ where: { id: commentId } });
}
