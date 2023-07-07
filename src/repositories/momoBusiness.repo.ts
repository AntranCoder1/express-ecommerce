import { MomoBusiness } from "../models/momoBusiness.model";
export const momoBusinessGetByUser = async (user: any) => {
  const result = await MomoBusiness.findOne({
    userType: user.type,
    userId: user._id,
  });
  return result;
};
export const momoBusinessCreate = async (body: any) => {
  const newMomoBusiness = new MomoBusiness(body);
  await newMomoBusiness.save();
  return newMomoBusiness._id;
};
export const momoBusinessUpdate = async (id: any, body: any) => {
  const modified = await MomoBusiness.findByIdAndUpdate(id, body);
  return modified._id;
};
export const momoBusinessDelete = async (id: any) => {
  const result = await MomoBusiness.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Tài khoản MOMO đã được xóa.";
  } else {
    return "Không có tài khoản MOMO nào bị xóa.";
  }
};
