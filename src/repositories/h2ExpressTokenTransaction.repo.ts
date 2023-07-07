import { H2ExpressTokenTransaction } from "../models/h2ExpressTokenTransaction.model";

export const createTransaction = (data: any) => {
  const newTransaction = new H2ExpressTokenTransaction(data);
  return newTransaction.save();
};
