import { hashSync, compareSync } from "bcrypt";
import { SALT_ROUNDS } from "../../../../config/config.service.js";

export const Hash = ({ plainText, saltRounds = SALT_ROUNDS }) => {
  return hashSync(plainText, Number(saltRounds));
};

export const Compare = ({ plainText, cipherText }) => {
  return compareSync(plainText, cipherText);
};
