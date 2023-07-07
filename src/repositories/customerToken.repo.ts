import mongoose from "mongoose";
import { CustomerToken } from "../models/customerToken.model";

export const createToken = (data: any) => {
  const newCustomerToken = new CustomerToken(data);
  return newCustomerToken.save();
};

export const findTokenWithCustomerId = (customerId: any) => {
  return CustomerToken.findOne({ customer: customerId });
};

export const updateToken = (customerTokenId: any, data: any) => {
  return CustomerToken.updateOne({ _id: customerTokenId }, data);
};

export const findHistory = (customerId: any, startDate: any, endDate: any) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$customer", new mongoose.Types.ObjectId(customerId)],
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
  return CustomerToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "customer_token_transaction",
        localField: "_id",
        foreignField: "customerToken",
        as: "transactionHistory",
      },
    },
  ]);
};

export const updateTokenWithCustomerId = (customerTokenId: any, data: any) => {
  return CustomerToken.updateOne({ customer: customerTokenId }, data);
};

export const findHistoryToken = (customerId: any) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$customer", new mongoose.Types.ObjectId(customerId)],
  });

  return CustomerToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "customer_token_transaction",
        localField: "_id",
        foreignField: "customerToken",
        as: "transactionHistory",
      },
    },
  ]);
};
