import mongoose, { Types } from "mongoose";
import { transactionStatusEnum, transactionTypeEnum } from "../../common/enum/user.enum.js";

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: Types.ObjectId,
      ref: "account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(transactionTypeEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(transactionStatusEnum),
      default: transactionStatusEnum.pending,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const transactionModel =
  mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

export default transactionModel;
