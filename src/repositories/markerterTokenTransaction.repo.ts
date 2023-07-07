import { MarketerTokenTransaction } from "../models/markerterTokenTransaction.model";

export const createTransaction = (data: any) => {
  const newTransaction = new MarketerTokenTransaction(data);
  return newTransaction.save();
};
