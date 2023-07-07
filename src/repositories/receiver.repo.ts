import { Receiver } from "../models/receiver.model";
export const receiverCreate = async (body: any) => {
  const newReceiver = new Receiver(body);
  await newReceiver.save();
  return newReceiver._id;
};
export const receiverUpdate = async (id: any, body: any) => {
  const modified = await Receiver.findByIdAndUpdate(id, body);
  return modified._id;
};
export const receiverGetList = async (customerId: any) => {
  const result = await Receiver.find({ customer: customerId });
  return result;
};
export const receiverDelete = async (id: any) => {
  const result = await Receiver.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Thông tin người nhận đã được xóa.";
  } else {
    return "Không có thông tin người nhận nào bị xóa.";
  }
};
