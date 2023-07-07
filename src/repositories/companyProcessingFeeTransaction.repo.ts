import { CompanyProcessingFeeTransaction } from "../models/companyProcessingFeeTransaction.model";

export const createTransaction = (data: any) => {
  const newTransaction = new CompanyProcessingFeeTransaction(data);
  return newTransaction.save();
};
