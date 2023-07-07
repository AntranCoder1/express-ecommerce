import mongoose from "mongoose";
import { CompanyTokenTransaction } from "../models/companyTokenTransaction.model";

export const createTransaction = (data: any) => {
  const newTransaction = new CompanyTokenTransaction(data);
  return newTransaction.save();
};

export const findByCompanyTokenId = (
  companyTokenId: any,
  startDate: any,
  endDate: any
) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$companyToken", new mongoose.Types.ObjectId(companyTokenId)],
  });

  if (!!startDate && !!endDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    endDateTime.setHours(23, 59, 59, 999);

    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }

  return CompanyTokenTransaction.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
  ]);
};
