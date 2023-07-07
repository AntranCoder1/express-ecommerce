import { CustomerTransactionLog } from "../models/customerTransactionLog.model";
import mongoose from "mongoose";

export const createTransactionLog = (data: any) => {
  const newTransaction = new CustomerTransactionLog(data);
  return newTransaction.save();
};

export const getTransactionLogByCustomer = async (
  customerId,
  method,
  activity,
  startDate,
  finishDate,
  tradingCode,
  offset,
  page
  // deposit
) => {
  const transactionQuery = [];

  if (customerId) {
    transactionQuery.push({
      $eq: ["$customer", new mongoose.Types.ObjectId(customerId)],
    });
  }

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
  if (!!tradingCode) {
    transactionQuery.push({
      $eq: ["$idType", new mongoose.Types.ObjectId(tradingCode)],
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
        as: "customers",
      },
    },
    { $unwind: "$customers" },
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

  const result = await CustomerTransactionLog.aggregate(query);
  return result;
};

export const totalByCustomer = async (data: any) => {
  const depositQuery = [];
  if (!!data.customerId) {
    depositQuery.push({
      $eq: ["$customer", new mongoose.Types.ObjectId(data.customerId)],
    });
  }

  if (data.deposit && data.deposit === 2) {
    depositQuery.push({
      $eq: ["$type", "deposit"],
    });
  }
  if (data.deposit && data.deposit === 3) {
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

  if (!!data.tradingCode) {
    depositQuery.push({
      $eq: ["$idType", new mongoose.Types.ObjectId(data.tradingCode)],
    });
  }

  let query: any = [];

  if (!!data.customerId) {
    console.log("vao day");

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
          as: "customers",
        },
      },
      { $unwind: "$customers" },
      { $sort: { createdAt: -1 } },
    ];
  } else {
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
  }

  if (!!data.name || data.name) {
    query.push({
      $match: {
        "customer.fullName": { $regex: data.name, $options: "i" },
      },
    });
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
  //       $expr: { $and: query },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },

  console.log("query", query);

  // ];

  const result = await CustomerTransactionLog.aggregate(query);

  console.log("result", result);

  if (result.length > 0) {
    return result.length;
    // return result[0].count;
  } else {
    return 0;
  }
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
        "customer.fullName": { $regex: name, $options: "i" },
      },
    });
  }

  const result = await CustomerTransactionLog.aggregate(query);
  return result;
};
