import mongoose from "mongoose";
import { CompanyToken } from "../models/companyToken.model";

export const createCompanyToken = (data: any) => {
  const newCompanyToken = new CompanyToken(data);
  return newCompanyToken.save();
};

export const getTokenWithCompany = (companyId: string) => {
  return CompanyToken.findOne({ company: companyId });
};

export const editToken = (companyId: string, token: number) => {
  return CompanyToken.updateOne({ company: companyId }, { token });
};

export const findAll = () => {
  return CompanyToken.find();
};

export const updateCompanyToken = (companyTokenId: any, data: any) => {
  return CompanyToken.updateOne({ company: companyTokenId }, data);
};

export const transactionHistory = (companyId: any) => {
  const transferQuery = [];
  transferQuery.push({
    $eq: ["$company", new mongoose.Types.ObjectId(companyId)],
  });

  // if (!!startDate && !!endDate) {
  //   transferQuery.push({
  //     $and: [
  //       { $gte: ["$createdAt", new Date(startDate)] },
  //       { $lte: ["$createdAt", new Date(endDate)] },
  //     ],
  //   });
  // }
  return CompanyToken.aggregate([
    {
      $match: {
        $expr: { $and: transferQuery },
      },
    },
    {
      $lookup: {
        from: "company_token_transaction",
        localField: "_id",
        foreignField: "companyToken",
        as: "historyToken",
      },
    },
  ]);
};

export const countList = (data: any) => {
  const opAnd: any = [];

  opAnd.push({ company: new mongoose.Types.ObjectId(data.companyId) });

  if (!!data.endDate && !!data.startDate) {
    opAnd.push({ createdAt: { $lte: new Date(data.endDate) } });
    opAnd.push({ createdAt: { $lte: new Date(data.startDate) } });
  }
  return CompanyToken.countDocuments({ $and: opAnd });
};
