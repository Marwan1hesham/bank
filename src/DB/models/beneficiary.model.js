import mongoose, { Types } from "mongoose";


const transactionSchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: Types.ObjectId,
      ref: "auth",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      ref: "account",
    },
    bankName: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
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
  mongoose.models.transaction ||
  mongoose.model("transaction", transactionSchema);

export default transactionModel;
