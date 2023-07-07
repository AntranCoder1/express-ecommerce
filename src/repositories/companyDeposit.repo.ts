import { CompanyDeposit } from "../models/companyDeposit.model";
import mongoose from "mongoose";

export const createCompanyDeposit = (body) => {
  const newCompanyDeposit = new CompanyDeposit(body);
  return newCompanyDeposit.save();
};
export const totalByCompany = (
  company,
  method,
  status,
  startDate,
  finishDate
) => {
  const depositQuery = [];
  depositQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
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
  if (status !== "") {
    if (status === "0") {
      depositQuery.push({
        $eq: ["$status", Number(status)],
      });
    } else {
      depositQuery.push({
        $gt: ["$status", 0],
      });
    }
  }
  return CompanyDeposit.aggregate([
    {
      $match: {
        $expr: { $and: depositQuery },
      },
    },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
};
export const getByCompany = (
  company,
  method,
  status,
  startDate,
  finishDate,
  offset,
  page
) => {
  const depositQuery = [];
  depositQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(company)],
  });
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
  if (status !== "") {
    console.log(typeof status);

    if (status === "0") {
      depositQuery.push({
        $eq: ["$status", Number(status)],
      });
    } else {
      depositQuery.push({
        $gt: ["$status", 0],
      });
    }
  }
  return CompanyDeposit.aggregate([
    {
      $match: {
        $expr: { $and: depositQuery },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * offset },
    { $limit: offset },
  ]);
};

export const update = (id, data) => {
  return CompanyDeposit.updateOne({ _id: id }, { $set: data });
};

export const totalAll = async (name, method, status, startDate, finishDate) => {
  const depositQuery = [];
  if (!!startDate && !!finishDate) {
    depositQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    depositQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    depositQuery.push({
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
  if (depositQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: depositQuery },
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
  const result = await CompanyDeposit.aggregate(query);
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
  const depositQuery = [];
  if (!!startDate && !!finishDate) {
    depositQuery.push({
      $and: [
        { $gte: ["$createdAt", new Date(startDate)] },
        { $lte: ["$createdAt", new Date(finishDate)] },
      ],
    });
  }
  if (!!method) {
    depositQuery.push({
      $eq: ["$transferMethod", method],
    });
  }
  if (status >= 0) {
    depositQuery.push({
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
  if (depositQuery.length !== 0) {
    query.push({
      $match: {
        $expr: { $and: depositQuery },
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
  const result = await CompanyDeposit.aggregate(query);
  return result;
};

export const getByOrderTransferId = (orderTransferId) => {
  return CompanyDeposit.findOne({ orderTransferId });
};
