import joi from "joi";

export const depositSchema = {
  body: joi
    .object({
      amount: joi.number().required().min(0),
    })
    .required(),
};

export const withdrawSchema = {
  body: joi
    .object({
      amount: joi.number().required().min(0),
    })
    .required(),
};
