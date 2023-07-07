import { DevAnnounce } from "../models/devAnnounce.model";
export const devAnnounceCreate = async (body: any) => {
  const newAnnounce = new DevAnnounce(body);
  await newAnnounce.save();
  return newAnnounce._id;
};
export const devAnnounceUpdate = async (id: any, body: any) => {
  const modified = await DevAnnounce.findByIdAndUpdate(id, body);
  return modified._id;
};
export const devAnnounceDelete = async (id: any) => {
  const result = await DevAnnounce.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Thông báo từ nhóm phát triển đã được xóa.";
  } else {
    return "Không có thông báo nào từ nhóm phát triển bị xóa.";
  }
};
export const devAnnounceGetList = async () => {
  const result = await DevAnnounce.find().sort({ createdAt: -1 });
  return result;
};
