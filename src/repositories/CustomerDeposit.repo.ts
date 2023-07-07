import { CustomerDeposit } from "../models/customerDeposit.model";

export const createCustomerDeposit = (body) => {
  const newCustomerDeposit = new CustomerDeposit(body);
  return newCustomerDeposit.save();
};

export const getByOrderTransferId = (orderTransferId) => {
  return CustomerDeposit.findOne({ orderTransferId });
};

export const update = (id, data) => {
  return CustomerDeposit.updateOne({ _id: id }, { $set: data });
};
