import { Schema, model, Types } from "mongoose";
import type { Document } from "mongoose";
interface FriendShip extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}

const FriendShipSchema = new Schema<FriendShip>(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<FriendShip>("FriendShip", FriendShipSchema);
