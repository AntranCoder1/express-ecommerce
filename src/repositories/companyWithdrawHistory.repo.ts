import { CompanyWithdrawHistory } from "../models/companyWithdrawHistory.model";

export const createWithdraw = (data: any) => {
  const newWithdraw = new CompanyWithdrawHistory(data);
  return newWithdraw.save();
};

export const update = (id, data) => {
  return CompanyWithdrawHistory.updateOne({ _id: id }, { $set: data });
};
