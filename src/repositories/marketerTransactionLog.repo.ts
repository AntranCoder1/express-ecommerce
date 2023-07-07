import { MarketerTransactionLog } from "../models/marketerTransactionLog.model";
import mongoose from "mongoose";

export const createMarketerTransactionLog = (body) => {
  const newMarketerTransactionLog = new MarketerTransactionLog(body);
  return newMarketerTransactionLog.save();
};

export const getTransactionLogByMarketer = (data: any) => {
  const transactionQuery = [];

  if (!!data.marketer) {
    transactionQuery.push({
      $eq: ["$marketer", new mongoose.Types.ObjectId(data.marketer)],
    });
  }
  if (data.deposit === 2) {
    transactionQuery.push({
      $eq: ["$type", "deposit"],
    });
  }
  if (data.deposit === 3) {
    transactionQuery.push({
      $eq: ["$type", "withdraw"],
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
  return MarketerTransactionLog.aggregate([
    {
      $match: {
        $expr: { $and: transactionQuery },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (data.page - 1) * data.offset },
    { $limit: data.offset },
  ]);
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
        from: "marketers",
        let: {
          marketer_id: "$marketer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$marketer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "marketer",
      },
    },
    { $unwind: "$marketer" },
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
        "marketer.name": { $regex: name, $options: "i" },
      },
    });
  }
  const result = await MarketerTransactionLog.aggregate(query);
  return result;
};

export const totalByMarketer = async (data: any) => {
  const depositQuery = [];

  if (!!data.marketer) {
    depositQuery.push({
      $eq: ["$marketer", new mongoose.Types.ObjectId(data.marketer)],
    });
  }
  if (data.deposit === 2) {
    depositQuery.push({
      $eq: ["$type", "deposit"],
    });
  }
  if (data.deposit === 3) {
    depositQuery.push({
      $eq: ["$type", "withdraw"],
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

  let query: any = [];
  query = [
    {
      $lookup: {
        from: "marketers",
        let: {
          marketer_id: "$marketer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$marketer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "marketer",
      },
    },
    { $unwind: "$marketer" },
    { $sort: { createdAt: -1 } },
  ];
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

  if (!!data.name) {
    query.push({
      $match: {
        "marketer.name": { $regex: data.name, $options: "i" },
      },
    });
  }

  // const pipeline = [
  //   {
  //     $match: {
  //       $expr: { $and: query },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },
  // ];

  const result = await MarketerTransactionLog.aggregate(query);

  if (result.length > 0) {
    // return result[0].count;
    return result.length;
  } else {
    return 0;
  }
};
