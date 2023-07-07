import { MarketerWithdrawHistory } from "../models/marketerWithdrawHistory.model";
import mongoose from "mongoose";

export const createMarketerWithdrawHistory = (body) => {
  const newMarketerWithdrawHistory = new MarketerWithdrawHistory(body);
  return newMarketerWithdrawHistory.save();
};

export const getByMarketer = (
  marketer,
  method,
  status,
  startDate,
  finishDate
) => {
  const withdrawQuery = [];
  withdrawQuery.push({
    $eq: ["$marketer", new mongoose.Types.ObjectId(marketer)],
  });
  if (!!startDate && !!finishDate) {
    withdrawQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
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
  return MarketerWithdrawHistory.aggregate([
    {
      $match: {
        $expr: { $and: withdrawQuery },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
};

export const countList = async (data: any) => {
  const withdrawQuery = [];

  if (!!data.id) {
    withdrawQuery.push({
      $eq: ["$marketer", new mongoose.Types.ObjectId(data.id)],
    });
  }
  if (!!data.startDate && !!data.finishDate) {
    withdrawQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(data.startDate)] },
        { $lte: ["$createdAt", new Date(data.finishDate)] },
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
        "marketer.name": { $regex: data.name, $options: "i" },
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

  const result = await MarketerWithdrawHistory.aggregate(query);

  if (result.length > 0) {
    return result.length;
    // return result[0].count;
  } else {
    return 0;
  }
};

export const update = (id, data) => {
  return MarketerWithdrawHistory.updateOne({ _id: id }, { $set: data });
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
        "marketer.name": { $regex: name, $options: "i" },
      },
    });
  }
  const result = await MarketerWithdrawHistory.aggregate(query);
  return result;
};

export const getById = (id) => {
  return MarketerWithdrawHistory.findOne({ _id: id }).populate({
    path: "marketer",
    model: "Marketer",
    select: { name: 1, phoneNumber: 1 },
  });
};
