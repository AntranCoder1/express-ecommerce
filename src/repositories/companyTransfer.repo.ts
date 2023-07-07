import { CompanyTransfer } from "../models/companyTransfer.model";
import mongoose from "mongoose";

export const createCompanyTransfer = (body) => {
  const newCompanyTransfer = new CompanyTransfer(body);
  return newCompanyTransfer.save();
};

export const totalByCompany = (
  company,
  method,
  activity,
  startDate,
  finishDate
) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
  if (!!startDate && !!finishDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    transferQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (activity !== "") {
    transferQuery.push({
      $eq: ["$type", activity],
    });
  }
  return CompanyTransfer.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
};
export const getByCompany = (
  company,
  method,
  activity,
  startDate,
  finishDate,
  offset,
  page
) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
  if (!!startDate && !!finishDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    transferQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (activity !== "") {
    transferQuery.push({
      $eq: ["$type", activity],
    });
  }
  return CompanyTransfer.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * offset },
    { $limit: offset },
  ]);
};

export const update = (id, data) => {
  return CompanyTransfer.updateOne({ _id: id }, { $set: data });
};

export const totalAll = async (name, method, status, startDate, finishDate) => {
  const transferQuery = [];
  if (!!startDate && !!finishDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    transferQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    transferQuery.push({
      $eq: ["$status", status],
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
  if (transferQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: transferQuery },
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
  const result = await CompanyTransfer.aggregate(query);
  return result;
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
  const transferQuery = [];
  if (!!startDate && !!finishDate) {
    transferQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    transferQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    transferQuery.push({
      $eq: ["$status", status],
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
  if (transferQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: transferQuery },
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
  const result = await CompanyTransfer.aggregate(query);
  return result;
};
