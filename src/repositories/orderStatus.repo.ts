import { OrderStatus } from "../models/orderStatus.model";
import { orderStatuses } from "../seeds/orderStatus.seed";

export const orderStatusGetList = async () => {
  const result = await OrderStatus.find();
  return result;
};
export const orderStatusCreate = async (body: any) => {
  const newStatus = new OrderStatus(body);
  newStatus.save();
  return newStatus._id;
};
export const orderStatusUpdate = async (id: any, body: any) => {
  const modified = await OrderStatus.findByIdAndUpdate(id, body);
  return modified._id;
};
export const orderStatusDelete = async (id: any) => {
  const result = await OrderStatus.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Trạng thái đơn hàng đã được xóa.";
  } else {
    return "Không có trạng thái đơn hàng nào bị xóa.";
  }
};
export const orderStatusSeed = async () => {
  for (const status of orderStatuses) {
    const document = await OrderStatus.findOne({ keyword: status.keyword });
    if (!document) {
      await orderStatusCreate(status);
    }
  }
  return "Tạo dữ liệu trạng thái đơn hàng thành công.";
};
export const orderStatusGetPendingId = async () => {
  const status = await OrderStatus.findOne({ keyword: "pending" }).select({
    _id: 1,
  });
  return status._id;
};
export const orderStatusGetId = async (keyword: string) => {
  const status = await OrderStatus.findOne({ keyword });
  if (status) {
    return status._id;
  } else {
    let seed: any;
    for (const orderStatus of orderStatuses) {
      if (orderStatus.keyword === keyword) {
        seed = orderStatus;
        break;
      }
    }
    if (seed.keyword) {
      return await orderStatusCreate(seed);
    } else {
      return null;
    }
  }
};

export const getStatusById = async (id) => {
  return OrderStatus.findOne({ _id: id });
};
