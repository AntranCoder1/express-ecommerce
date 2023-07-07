import { CustomerWithdraw } from "../models/customerWithdraw.model";
import mongoose from "mongoose";

export const createWithdraw = (data: any) => {
  const newWithdraw = new CustomerWithdraw(data);
  return newWithdraw.save();
};

export const update = (id, data) => {
  return CustomerWithdraw.updateOne({ _id: id }, { $set: data });
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
        from: "customers",
        let: {
          customer_id: "$customer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$customer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, fullName: 1, phoneNumber: 1 },
          },
        ],
        as: "customer",
      },
    },
    { $unwind: "$customer" },
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
        "customer.fullName": { $regex: name, $options: "i" },
      },
    });
  }

  const result = await CustomerWithdraw.aggregate(query);
  return result;
};

export const countList = async (data: any) => {
  const withdrawQuery = [];

  if (!!data.customerId) {
    withdrawQuery.push({
      $eq: ["$customer", new mongoose.Types.ObjectId(data.customerId)],
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
        from: "customers",
        let: {
          customer_id: "$customer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$customer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, fullName: 1, phoneNumber: 1 },
          },
        ],
        as: "customer",
      },
    },
    { $unwind: "$customer" },
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
        "customer.fullName": { $regex: data.name, $options: "i" },
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

  const result = await CustomerWithdraw.aggregate(query);

  if (result.length > 0) {
    return result.length;
    // return result[0].count;
  } else {
    return 0;
  }
};

export const getById = (id) => {
  return CustomerWithdraw.findOne({ _id: id }).populate({
    path: "customer",
    model: "Customer",
    select: { fullName: 1, phoneNumber: 1 },
  });
};
