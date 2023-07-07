import { CollaboratorWithdrawHistory } from "../models/collaboratorWithdrawHistory.model";
import mongoose from "mongoose";

export const createCollaboratorWithdrawHistory = (body) => {
  const newCollaboratorWithdrawHistory = new CollaboratorWithdrawHistory(body);
  return newCollaboratorWithdrawHistory.save();
};

export const getByCollaborator = (
  collaborator,
  method,
  status,
  startDate,
  finishDate,
  offset,
  page
) => {
  const withdrawQuery = [];
  withdrawQuery.push({
    $eq: ["$collaborator", new mongoose.Types.ObjectId(collaborator)],
  });
  if (!!startDate && !!finishDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    withdrawQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!method) {
    withdrawQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    withdrawQuery.push({
      $eq: ["$status", status],
    });
  }
  return CollaboratorWithdrawHistory.aggregate([
    {
      $match: {
        $expr: { $and: withdrawQuery },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * offset },
    { $limit: offset },
  ]);
};

export const update = (id, data) => {
  return CollaboratorWithdrawHistory.updateOne({ _id: id }, { $set: data });
};

export const getAll = async (
  name,
  method,
  status,
  startDate,
  finishDate,
  offset,
  page
) => {
  const withdrawQuery = [];
  if (!!startDate && !!finishDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    withdrawQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!method) {
    withdrawQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    withdrawQuery.push({
      $eq: ["$status", status],
    });
  }

  let query: any = [];
  query = [
    {
      $lookup: {
        from: "collaborators",
        let: {
          collaborator_id: "$collaborator",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$collaborator_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "collaborator",
      },
    },
    { $unwind: "$collaborator" },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * offset },
    { $limit: offset },
  ];
  if (withdrawQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: withdrawQuery },
      },
    });
  }

  if (!!name) {
    query.push({
      $match: {
        "collaborator.name": { $regex: name, $options: "i" },
      },
    });
  }

  const result = await CollaboratorWithdrawHistory.aggregate(query);
  return result;
};

export const getById = (id) => {
  return CollaboratorWithdrawHistory.findOne({ _id: id }).populate({
    path: "collaborator",
    model: "Collaborator",
    select: { name: 1, phoneNumber: 1 },
  });
};

export const findAllWithdrawToken = (collabId: any) => {
  return CollaboratorWithdrawHistory.aggregate([
    {
      $match: {
        collaborator: new mongoose.Types.ObjectId(collabId),
        transferMethod: "token",
        status: 2,
      },
    },
  ]);
};

export const countList = async (data: any) => {
  const withdrawQuery = [];

  if (!!data.id) {
    withdrawQuery.push({
      $eq: ["$collaborator", new mongoose.Types.ObjectId(data.id)],
    });
  }
  if (!!data.startDate && !!data.finishDate) {
    const startDateTime = new Date(data.startDate);
    const endDateTime = new Date(data.finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    withdrawQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!data.method) {
    withdrawQuery.push({
      $eq: ["$transferMethod", data.method],
    });
  }
  if (data.status >= 0) {
    withdrawQuery.push({
      $eq: ["$status", data.status],
    });
  }

  let query: any = [];
  query = [
    {
      $lookup: {
        from: "collaborators",
        let: {
          collaborator_id: "$collaborator",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$collaborator_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "collaborator",
      },
    },
    { $unwind: "$collaborator" },
    { $sort: { createdAt: -1 } },
  ];
  if (withdrawQuery.length !== 0) {
    query.push(
      {
        $match: {
          $expr: { $and: withdrawQuery },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    );
  }

  if (!!data.name) {
    query.push({
      $match: {
        "collaborator.name": { $regex: data.name, $options: "i" },
      },
    });
  }

  // const pipeline = [
  //   {
  //     $match: {
  //       $expr: { $and: withdrawQuery },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },
  // ];

  const result = await CollaboratorWithdrawHistory.aggregate(query);

  if (result.length > 0) {
    return result.length;
    // return result[0].count;
  } else {
    return 0;
  }
};
