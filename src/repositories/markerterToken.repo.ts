import mongoose from "mongoose";
import { MarketerToken } from "../models/makerterToken.model";

export const createToken = (data: any) => {
  const newMarkerterToken = new MarketerToken(data);
  return newMarkerterToken.save();
};

export const findByMarkerterId = (markerterId: any) => {
  return MarketerToken.findOne({ markerter: markerterId });
};

export const updateToken = (markerterId: any, companyId: any, data: any) => {
  return MarketerToken.updateOne(
    { company: companyId, markerter: markerterId },
    data
  );
};

export const historyTransaction = (
  markerterId: any,
  startDate: any,
  endDate: any
) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$markerter", new mongoose.Types.ObjectId(markerterId)],
  });

  if (!!startDate && !!endDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(endDate)] },
      ],
    });
  }

  return MarketerToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "marketer_token_transaction",
        localField: "_id",
        foreignField: "markerterToken",
        as: "historyToken",
      },
    },
  ]);
};

export const findDepositHistory = (markerterId: any) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$markerter", new mongoose.Types.ObjectId(markerterId)],
  });

  return MarketerToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "marketer_token_transaction",
        localField: "_id",
        foreignField: "markerterToken",
        as: "historyToken",
      },
    },
  ]);
};
