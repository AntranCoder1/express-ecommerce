import { ListFeeTransactionLog } from "../models/companyListFeeTransactionLog.model";
import mongoose from "mongoose";

export const listFeeTransactionLogCreate = async (body: any) => {
  const newListFeeTransaction = new ListFeeTransactionLog(body);
  return newListFeeTransaction.save();
};
