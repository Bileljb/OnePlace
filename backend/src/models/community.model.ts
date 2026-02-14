import mongoose, { Document, Schema } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description?: string;
  creator: mongoose.Types.ObjectId; // reference to User
  isPrivate: boolean;
  price: number; // 0 = free community
}

const communitySchema: Schema<ICommunity> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPrivate: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Community = mongoose.model<ICommunity>("Community", communitySchema);

