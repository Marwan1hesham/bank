import { JWT_SECRET } from "../../../config/config.service.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { generateToken } from "../../common/utils/token.service.js";
import * as db_service from "../../DB/db.service.js";
import accountModel from "../../DB/models/account.model.js";
import authModel from "../../DB/models/auth.model.js";

export const register = async (req, res, next) => {
  const { fullName, email, password, cPassword, role, accountNumber, balance } = req.body;

  const emailExists = await db_service.findOne({
    model: authModel,
    filter: { email },
  });
  if (emailExists) {
    throw new Error("Email already exists", {cause: 409});
  }

  if (password !== cPassword) {
    throw new Error("Passwords do not match", {cause: 400});
  }

  const user = await db_service.create({
    model: authModel,
    data: { fullName, email, password: Hash({plainText: password}), role },
  });

  const account = await db_service.create({
    model: accountModel,
    data: { userId: user._id, accountNumber, balance },
  });

  return res.status(201).json({ message: "User created successfully", account });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db_service.findOne({
    model: authModel,
    filter: { email },
  });
  if (!user) {
    throw new Error("Email not found", {cause: 404});
  }

  if(!Compare({plainText: password, cipherText: user.password})){
    throw new Error("Invalid password", {cause: 401});
  }

  const access_token = generateToken({
    payload: {id: user._id, role: user.role},
    secret_key: JWT_SECRET,
    options: {expiresIn: "1h"}
  })

  return res.status(200).json({ message: "User logged in successfully", access_token });
};
