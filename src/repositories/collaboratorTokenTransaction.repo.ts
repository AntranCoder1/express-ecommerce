import { CollaboratorTokenTransaction } from "../models/collaboratorTokenTransaction.model";

export const createTransaction = (data: any) => {
  const newTransaction = new CollaboratorTokenTransaction(data);
  return newTransaction.save();
};
