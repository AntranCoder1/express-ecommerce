import { CompanyProcessingFee } from "../models/companyProcessingFee.model";

export const createProcessingFee = (data: any) => {
  const newProcessingFee = new CompanyProcessingFee(data);
  return newProcessingFee.save();
};
