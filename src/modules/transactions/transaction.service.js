import {
  statusEnum,
  transactionStatusEnum,
  transactionTypeEnum,
} from "../../common/enum/user.enum.js";
import accountModel from "../../DB/models/account.model.js";
import transactionModel from "../../DB/models/transaction.model.js";
import * as db_service from "./../../DB/db.service.js";

export const deposit = async (req, res, next) => {
  const { amount } = req.body;

  const account = await db_service.findOne({
    model: accountModel,
    filter: { userId: req.user.id },
  });

  if (!account) {
    await db_service.findOneAndUpdate({
      model: transactionModel,
      filter: { userId: req.user.id },
      update: { status: transactionStatusEnum.failed },
    });
    return next(new Error("Account not found"));
  }

  if (account.status === statusEnum.frozen) {
    throw new Error("Account is frozen");
  }

  const balanceBefore = account.balance;

  const balanceAfter = (account.balance += amount);
  await account.save();

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: account._id,
      amount,
      type: transactionTypeEnum.deposit,
      balanceBefore,
      balanceAfter,
      status: transactionStatusEnum.success,
    },
  });

  return res.status(200).json({ message: "Deposit successful", transaction });
};

export const withdraw = async (req, res, next) => {
  const { amount } = req.body;

  const account = await db_service.findOne({
    model: accountModel,
    filter: { userId: req.user.id },
  });

  if (!account) {
    await db_service.findOneAndUpdate({
      model: transactionModel,
      filter: { userId: req.user.id },
      update: { status: transactionStatusEnum.failed },
    });
    return next(new Error("Account not found"));
  }

  if (account.status === statusEnum.frozen) {
    throw new Error("Account is frozen");
  }

  const balanceBefore = account.balance;

  const balanceAfter = (account.balance -= amount);
  await account.save();

  if (balanceAfter < 0) {
    await db_service.create({
      model: transactionModel,
      data: {
        accountId: account._id,
        amount,
        type: transactionTypeEnum.withdrawal,
        balanceBefore,
        balanceAfter,
        status: transactionStatusEnum.failed,
      },
    });
    throw new Error("Your balance is not enough", { cause: 400 });
  }

  const transaction = await db_service.create({
    model: transactionModel,
    data: {
      accountId: account._id,
      amount,
      type: transactionTypeEnum.withdrawal,
      balanceBefore,
      balanceAfter,
      status: transactionStatusEnum.success,
    },
  });

  return res.status(200).json({ message: "Withdraw successful", transaction });
};

export const myTransactions = async (req, res, next) => {
  const { page } = req.query;

  const skip = (page - 1) * 10;

  const transactions = await db_service.find({
    model: transactionModel,
    filter: { userId: req.user.id },
    options: {
      skip,
      limit: 10,
    },
  });

  return res.status(200).json({ message: "My transactions", transactions });
};

export const getTransactionById = async (req, res, next) => {
  const { id } = req.params;

  const transaction = await db_service.findById({
    model: transactionModel,
    id,
  });

  if (!transaction) {
    throw new Error("Transaction not found", { cause: 404 });
  }

  return res.status(200).json({ message: "Done", transaction });
};
