import { OrderRefund } from "../models/orderRefund.model";
export const orderRefundGetById = async (id: any) => {
  const refund = await OrderRefund.findOne({ _id: id });
  return refund;
};
export const orderRefundCreate = async (body: any) => {
  const newRefund = new OrderRefund(body);
  await newRefund.save();
  return newRefund._id;
};
export const orderRefundUpdate = async (id: any, body: any) => {
  const modified = await OrderRefund.findByIdAndUpdate(id, body);
  return modified._id;
};
export const orderRefundDeleteByOrder = async (orderId: any) => {
  const result = await OrderRefund.deleteOne({ order: orderId });
  if (result.deletedCount > 0) {
    return "Thông tin hoàn tiền của đơn hàng đã được xóa.";
  } else {
    return "Không có thông tin hoàn tiền nào của đơn hàng bị xóa.";
  }
};
