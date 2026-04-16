import authentication from "../../common/middleware/authentication.js";
import * as TS from "./transaction.service.js";
import { Router } from "express";
import { depositSchema, withdrawSchema } from "./transaction.validation.js";
import { validation } from "../../common/middleware/validation.js";
const transactionRouter = Router();

transactionRouter.post(
  "/deposit",
  authentication,
  validation(depositSchema),
  TS.deposit,
);

transactionRouter.post(
  "/withdraw",
  authentication,
  validation(withdrawSchema),
  TS.withdraw,
);

transactionRouter.get("/my", authentication, TS.myTransactions);

transactionRouter.get("/:id", authentication, TS.getTransactionById);

export default transactionRouter;
