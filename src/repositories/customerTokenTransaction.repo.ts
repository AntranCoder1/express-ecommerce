import { CustomerTokenTransaction } from "../models/customerTokenTransaction.model";

export const createTransaction = (data: any) => {
  const newCustomerTransaction = new CustomerTokenTransaction(data);
  return newCustomerTransaction.save();
};
