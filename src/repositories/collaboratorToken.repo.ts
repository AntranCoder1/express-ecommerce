import mongoose from "mongoose";
import { CollaboratorToken } from "../models/collaboratorToken.model";

export const createCollaboratorToken = (data: any) => {
  const newToken = new CollaboratorToken(data);
  return newToken.save();
};

export const findById = (collaboratorId: any) => {
  return CollaboratorToken.findOne({ _id: collaboratorId });
};

export const updateToken = (collaboratorId: any, data: any) => {
  return CollaboratorToken.updateOne({ collaborator: collaboratorId }, data);
};

export const findTokenWithCollabId = (collaboratorId: any) => {
  return CollaboratorToken.findOne({ collaborator: collaboratorId });
};

export const findHistoryToken = (
  collabId: any,
  startDate: any,
  endDate: any
) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$collaborator", new mongoose.Types.ObjectId(collabId)],
  });

  if (!!startDate && !!endDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(endDate)] },
      ],
    });
  }
  return CollaboratorToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "collaborator_token_transaction",
        localField: "_id",
        foreignField: "collaboratorToken",
        as: "transactionHistory",
      },
    },
  ]);
};

export const findDepositHistoryToken = (collabId: any) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$collaborator", new mongoose.Types.ObjectId(collabId)],
  });

  return CollaboratorToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "collaborator_token_transaction",
        localField: "_id",
        foreignField: "collaboratorToken",
        as: "transactionHistory",
      },
    },
  ]);
};
