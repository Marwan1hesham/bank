import express from "express";
import { PORT } from "../config/config.service.js";
import checkConnectionDB from "./DB/connectionDB.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/users/user.controller.js";
import transactionRouter from "./modules/transactions/transaction.controller.js";
const app = express();

const bootstrap = () => {
  const limiter = rateLimit({
    windowMs: 60 * 3 * 1000,
    limit: 20,
    statusCode: 400,
    handler: (req, res, next) => {
      return res
        .status(400)
        .json({ message: "Too many requests, please try again later" });
    },
  });

  app.use(cors(), helmet(), limiter, express.json());
  
  checkConnectionDB()

  app.get("/", (req, res, next) => {
    res.json({ message: "Welcome to the bank system" });
  });

  app.use("/auth", authRouter)
  app.use("/transactions", transactionRouter)

  app.use("{/*demo}", (req, res, next) => {
    throw new Error(`Url ${req.originalUrl} Not Found`, { cause: 404 });
  });

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default bootstrap;
