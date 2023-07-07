import { OrderCancel } from "../models/orderCancel.model";
import mongoose from "mongoose";

export const createOrderCancel = (data) => {
  const newOrderCancel = new OrderCancel(data);
  return newOrderCancel.save();
};

export const getByOrder = (order) => {
  return OrderCancel.findOne({ order });
};
