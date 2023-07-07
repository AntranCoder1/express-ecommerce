import { CompanyIncome } from "../models/companyIncome.model";

export const companyIncomeCreate = async (body: any) => {
  const newCompanyIncome = new CompanyIncome(body);
  return newCompanyIncome.save();
};

export const getByCompany = (id) => {
  return CompanyIncome.findOne({ company: id });
};

export const update = (id, data) => {
  return CompanyIncome.updateOne({ company: id }, { $set: data });
};
