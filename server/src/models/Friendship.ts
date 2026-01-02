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

FriendShipSchema.index({ requester: 1, status: 1 });
FriendShipSchema.index({ recipient: 1, status: 1 });

export default model<FriendShip>("FriendShip", FriendShipSchema);
