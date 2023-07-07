import { CollaboratorTransactionLog } from "../models/collaboratorTransactionLog.model";
import mongoose from "mongoose";

export const createCollaboratorTransactionLog = (body) => {
  const newCollaboratorTransactionLog = new CollaboratorTransactionLog(body);
  return newCollaboratorTransactionLog.save();
};

export const getTransactionLogByCollaborator = async (data: any) => {
  const transactionQuery = [];

  if (!!data.collaborator) {
    transactionQuery.push({
      $eq: ["$collaborator", new mongoose.Types.ObjectId(data.collaborator)],
    });
  }
  if (!!data.startDate && !!data.finishDate) {
    const startDateTime = new Date(data.startDate);
    const endDateTime = new Date(data.finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!data.method) {
    transactionQuery.push({
      $eq: ["$transferMethod", data.method],
    });
  }
  if (!!data.activity) {
    transactionQuery.push({
      $eq: ["$type", data.activity],
    });
  }
  if (!!data.deposit) {
    if (data.deposit === 2) {
      transactionQuery.push({
        $eq: ["$type", "deposit"],
      });
    } else if (data.deposit === 3) {
      transactionQuery.push({
        $eq: ["$type", "withdraw"],
      });
    }
  }

  const query: any = [];

  if (transactionQuery.length !== 0) {
    query.push(
      {
        $match: {
          $expr: { $and: transactionQuery },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (data.page - 1) * data.offset },
      { $limit: data.offset }
    );
  }

  const result = await CollaboratorTransactionLog.aggregate(query);
  return result;
};

export const getAll = async (
  name,
  method,
  activity,
  startDate,
  finishDate,
  offset,
  page
) => {
  const transactionQuery = [];
  if (!!startDate && !!finishDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!method) {
    transactionQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (!!activity) {
    transactionQuery.push({
      $eq: ["$type", activity],
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
  if (transactionQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: transactionQuery },
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
  const result = await CollaboratorTransactionLog.aggregate(query);
  return result;
};

export const totalByCollab = async (data: any) => {
  const depositQuery = [];

  if (!!data.collaborator) {
    depositQuery.push({
      $eq: ["$collaborator", new mongoose.Types.ObjectId(data.collaborator)],
    });
  }
  if (!!data.startDate && !!data.finishDate) {
    const startDateTime = new Date(data.startDate);
    const endDateTime = new Date(data.finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    depositQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!data.method) {
    depositQuery.push({
      $eq: ["$transferMethod", data.method],
    });
  }
  if (!!data.activity) {
    depositQuery.push({
      $eq: ["$type", data.activity],
    });
  }
  if (!!data.deposit) {
    if (data.deposit === 2) {
      depositQuery.push({
        $eq: ["$type", "deposit"],
      });
    } else if (data.deposit === 3) {
      depositQuery.push({
        $eq: ["$type", "withdraw"],
      });
    }
  }
  let query: any = [];

  if (data.isAdmin === true) {
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

    if (!!data.name) {
      query.push({
        $match: {
          "collaborator.name": { $regex: data.name, $options: "i" },
        },
      });
    }
  }

  if (depositQuery.length !== 0) {
    query.push(
      {
        $match: {
          $expr: { $and: depositQuery },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    );
  }

  // const pipeline = [
  //   {
  //     $match: {
  //       $expr: { $and: depositQuery },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },
  // ];

  const result = await CollaboratorTransactionLog.aggregate(query);

  console.log("result", result[0]);

  if (result.length > 0) {
    return result.length;
    // return result[0].count;
  } else {
    return 0;
  }
};
