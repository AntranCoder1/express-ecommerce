import { MaketerDeposit } from "../models/makerterDeposit.model";

export const createDeposit = (data: any) => {
  const newMaketerDeposit = new MaketerDeposit(data);
  return newMaketerDeposit.save();
};

export const getByOrderTransferId = (orderTransferId) => {
  return MaketerDeposit.findOne({ orderTransferId });
};

export const update = (id, data) => {
  return MaketerDeposit.updateOne({ _id: id }, { $set: data });
};
