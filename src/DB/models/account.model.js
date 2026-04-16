import mongoose, { Types } from "mongoose";
import { statusEnum } from "../../common/enum/user.enum.js";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "auth",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.active,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const accountModel =
  mongoose.models.account || mongoose.model("account", accountSchema);

export default accountModel;
