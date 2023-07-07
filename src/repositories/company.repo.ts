import { removeFile } from "../utils/upload.util";
import { Marketer } from "../models/marketer.model";
import { Company } from "../models/company.model";
export const companyGetById = async (id: any) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
    address: 1,
    marketers: 1,
    logo: 1,
    favicon: 1,
  };
  const data = await Company.findById(id).select(fieldsSelect);
  return data;
};
export const companyGetByFields = async (fields: {}) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
    address: 1,
    marketers: 1,
    logo: 1,
    favicon: 1,
  };
  const data = await Company.findOne(fields).select(fieldsSelect);
  return data;
};
export const companyGetPassword = async (id: any) => {
  const data = await Company.findById(id).select({
    password: 1,
  });
  return data;
};
export const companyGetHashedPasswordByEmail = async (email: string) => {
  const data = await Company.findOne({ email }).select({ password: 1 });
  if (!data || data === undefined) {
    return null;
  }
  return data.password;
};
export const companyChangePassword = async (body: any) => {
  const updated = await Company.findOneAndUpdate(
    { email: body.email },
    { password: body.password },
    { new: true }
  );
  return "Mật khẩu đăng nhập của doanh nghiệp đã được thay đổi thành công.";
};
export const isUniqueCompanyEmail = async (email: string) => {
  const data = await Company.findOne({ email });
  if (data == null) {
    return true;
  } else {
    return false;
  }
};
export const companyCreate = async (body: any) => {
  const newCompany = new Company(body);
  await newCompany.save();
  return newCompany._id;
};
export const companyUpdate = async (id: any, body: any) => {
  const modified = await Company.findByIdAndUpdate(id, body);
  return modified._id;
};
export const companyModifyMarketerQuantity = async (
  id: any,
  quantity: number
) => {
  const company = await Company.findById(id).select({ marketers: 1 });
  company.marketers =
    company.marketers + quantity >= 0 ? company.marketers + quantity : 0;
  company.save();
};
export const companyDelete = async (company: any) => {
  if (company.favicon) {
    removeFile(company.favicon.path);
  }
  if (company.logo) {
    removeFile(company.logo.path);
  }
  await Company.deleteOne({ _id: company._id });
  return "Doanh nghiệp đã được xóa thành công.";
};
export const companyGetListForMarketerRegistering = async () => {
  const data = await Company.find()
    .select({ _id: 1, name: 1 })
    .sort({ name: 1 });
  return data;
};
