import joi from "joi";

export const registerSchema = {
  body: joi
    .object({
      fullName: joi.string().min(5).max(40).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      phone: joi.string(),
      accountNumber: joi.string().required(),
      balance: joi.number().required().min(0),
    })
    .required()
    .with("password", "cPassword"),
};

export const loginSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    })
    .required(),
};
