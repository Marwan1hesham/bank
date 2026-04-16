import { verifyToken } from "../utils/token.service.js";
import * as db_service from "../../DB/db.service.js";
import authModel from "../../DB/models/auth.model.js";
import { JWT_SECRET } from "../../../config/config.service.js";

const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("Authorization token is required", { cause: 401 });
  }

  const decoded = verifyToken({ token: authorization, secret_key: JWT_SECRET });

  if (!decoded || !decoded.id) {
    throw new Error("Invalid token", { cause: 401 });
  }

  const user = await db_service.findOne({
    model: authModel,
    filter: { _id: decoded.id },
  });

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  req.user = user;
  next();
};

export default authentication;
