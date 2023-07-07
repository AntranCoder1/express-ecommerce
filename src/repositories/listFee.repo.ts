import { ListFee } from "../models/companyLisFee.model";
import mongoose from "mongoose";

export const listFeeCreate = async (body: any) => {
  const newListFee = new ListFee(body);
  return newListFee.save();
};
