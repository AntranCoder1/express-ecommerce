import { Marketer } from "../models/marketer.model";
import { removeFile } from "../utils/upload.util";
//#region Atomics
export const isUniqueMarketerEmail = async (email: string) => {
  const data = await Marketer.findOne({ email });
  if (data !== null) {
    return false;
  } else {
    return true;
  }
};
//#endregion
//#region Gets
export const marketerGetById = async (id: any) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
    address: 1,
    marketers: 1,
    avatar: 1,
    company: 1,
  };
  const data = await Marketer.findById(id)
    .select(fieldsSelect)
    .populate([
      {
        path: "company",
        model: "Company",
        select: "name",
      },
    ]);
  return data;
};
export const marketerGetByFields = async (fields: {}) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
    address: 1,
    marketers: 1,
    avatar: 1,
    company: 1,
  };
  const data = await Marketer.findOne(fields)
    .select(fieldsSelect)
    .populate([
      {
        path: "company",
        model: "Company",
        select: "name",
      },
    ]);
  return data;
};
export const marketerGetPassword = async (id: any) => {
  const data = await Marketer.findById(id).select({
    password: 1,
  });
  return data;
};
export const marketerGetHashedPasswordByEmail = async (email: string) => {
  const data = await Marketer.findOne({ email }).select({ password: 1 });
  if (data === null) {
    return null;
  }
  return data.password;
};
export const marketerGetListByCompany = async (companyId: any) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
    address: 1,
    marketers: 1,
    avatar: 1,
    company: 1,
  };
  const data = await Marketer.find({ company: companyId }).select(fieldsSelect);
  return data;
};
//#endregion
//#region Modifies
export const marketerCreate = async (body: any) => {
  const newmarketer = new Marketer(body);
  await newmarketer.save();
  return newmarketer._id;
};
export const marketerUpdate = async (id: any, body: any) => {
  const modified = await Marketer.findByIdAndUpdate(id, body);
  return modified._id;
};
export const marketerChangePassword = async (body: any) => {
  await Marketer.findOneAndUpdate(
    { email: body.email },
    { password: body.password },
    { new: true }
  );
  return "Mật khẩu đăng nhập của người tiếp thị đã được thay đổi thành công.";
};
export const marketerModifyDomainQuantity = async (
  id: any,
  quantity: number
) => {
  const marketer = await Marketer.findById(id).select({ domains: 1 });
  marketer.domains =
    marketer.domains + quantity >= 0 ? marketer.domains + quantity : 0;
  marketer.save();
};
export const marketerDeleteManyByCompany = async (companyId: any) => {
  const marketers = await Marketer.find({ company: companyId });
  if (marketers.length > 0) {
    for (const marketer of marketers) {
      if (marketer.avatar) {
        removeFile(marketer.avatar.path);
      }

      await Marketer.deleteOne({ _id: marketer._id });
    }
  }
  return "Các người tiếp thị của doanh nghiệp đã được xóa thành công.";
};
//#endregion
//#region Delete
export const marketerDelete = async (marketer: any) => {
  if (marketer.avatar) {
    removeFile(marketer.avatar.path);
  }
  await Marketer.deleteOne({ _id: marketer._id });
  return "Xóa người tiếp thị thành công.";
};
//#endregion

export const findByEmail = (email: string) => {
  return Marketer.findOne({ email });
};
