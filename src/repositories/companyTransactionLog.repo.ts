import { CompanyTransactionLog } from "../models/companyTransactionLog.model";
import mongoose from "mongoose";

export const createCompanyTransactionLog = (body) => {
  const newCompanyTransactionLog = new CompanyTransactionLog(body);
  return newCompanyTransactionLog.save();
};

export const totalByCompany = (
  company,
  method,
  activity,
  startDate,
  finishDate
) => {
  const transactionQuery = [];
  transactionQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
  if (!!startDate && !!finishDate) {
    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
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
  return CompanyTransactionLog.aggregate([
    {
      $match: {
        $expr: { $and: transactionQuery },
      },
    },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
};

export const getTransactionLogByCompany = (
  company,
  method,
  activity,
  startDate,
  finishDate,
  offset,
  page
) => {
  const transactionQuery = [];
  transactionQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
  if (!!startDate && !!finishDate) {
    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
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
  return CompanyTransactionLog.aggregate([
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

export const totalAll = async (
  name,
  method,
  activity,
  startDate,
  finishDate
) => {
  const transactionQuery = [];
  if (!!startDate && !!finishDate) {
    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
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
        from: "companies",
        let: {
          company_id: "$company",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$company_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "company",
      },
    },
    { $unwind: "$company" },
    { $group: { _id: null, count: { $sum: 1 } } },
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
        "company.name": { $regex: name, $options: "g" },
      },
    });
  }
  const result = await CompanyTransactionLog.aggregate(query);
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
    transactionQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
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
        from: "companies",
        let: {
          company_id: "$company",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$company_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "company",
      },
    },
    { $unwind: "$company" },
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
        "company.name": { $regex: name, $options: "g" },
      },
    });
  }
  const result = await CompanyTransactionLog.aggregate(query);
  return result;
};
