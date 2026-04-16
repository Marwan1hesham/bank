import { Router } from "express";
const authRouter = Router();
import * as AS from "./user.service.js";
import { validation } from "../../common/middleware/validation.js";
import * as UV from "./user.validation.js";

authRouter.post("/register",validation(UV.registerSchema), AS.register);

authRouter.post("/login",validation(UV.loginSchema), AS.login);

export default authRouter;
