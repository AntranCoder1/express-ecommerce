import { H2ExpressTransactionLog } from "../models/h2ExpressTransactionLog.model";

export const createTransaction = (data: any) => {
  const newTransaction = new H2ExpressTransactionLog(data);
  return newTransaction.save();
};

export const getTransactionLog = (
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
  return H2ExpressTransactionLog.aggregate([
    {
      $match: {
        $expr: { $and: transactionQuery },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * offset },
    { $limit: offset },
  ]);
};

export const totalHistory = async (method, startDate, finishDate, activity) => {
  const depositQuery = [];

  if (!!startDate && !!finishDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    depositQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!method) {
    depositQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (!!activity) {
    depositQuery.push({
      $eq: ["$type", activity],
    });
  }

  const pipeline = [
    {
      $match: {
        $expr: { $and: depositQuery },
      },
    },
    { $group: { _id: null, count: { $sum: 1 } } },
  ];

  const result = await H2ExpressTransactionLog.aggregate(pipeline);

  if (result.length > 0) {
    return result[0].count;
  } else {
    return 0;
  }
};

export const findAll = () => {
  return H2ExpressTransactionLog.find();
};
