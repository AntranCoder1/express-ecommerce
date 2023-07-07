import { CollaboratorDeposit } from "../models/collaboratorDeposit.model";

export const createDeposit = (data: any) => {
  const newDeposit = new CollaboratorDeposit(data);
  return newDeposit.save();
};

export const getByOrderTransferId = (orderTransferId) => {
  return CollaboratorDeposit.findOne({ orderTransferId });
};

export const update = (id, data) => {
  return CollaboratorDeposit.updateOne({ _id: id }, { $set: data });
};
