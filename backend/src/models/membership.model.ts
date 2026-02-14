import mongoose, { Document, Schema } from "mongoose";

export type CommunityRole = "creator" | "admin" | "member";
export type MembershipStatus = "active" | "banned" | "cancelled" | "expired";
export type PaymentStatus = "pending" | "success" | "failed";

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;           // reference to User
  community: mongoose.Types.ObjectId;      // reference to Community
  role: CommunityRole;                     // creator, admin, member
  status: MembershipStatus;                // active, banned, cancelled
  joinedAt: Date;                          // date user joined
  subscriptionStart: Date;                 // start of the subscription
  subscriptionEnd: Date;                   // end of the subscription period (monthly)
  pricePaid: number;                        // amount paid this month
  paymentStatus: PaymentStatus;            // pending, success, failed
}

const membershipSchema: Schema<IMembership> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    role: {
      type: String,
      enum: ["creator", "admin", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "banned"],
      default: "active",
    },
    joinedAt: { type: Date, default: Date.now },
    subscriptionStart: { type: Date, default: Date.now },
    subscriptionEnd: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +1 month
    },
    pricePaid: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent the same user joining the same community more than once
membershipSchema.index({ user: 1, community: 1 }, { unique: true });

export const Membership = mongoose.model<IMembership>("Membership", membershipSchema);
