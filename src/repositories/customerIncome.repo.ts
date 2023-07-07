import { CustomerIncome } from "../models/customerIncome.model";

export const createIncome = (data: any) => {
  const newIncome = new CustomerIncome(data);
  return newIncome.save();
};

export const getByCustomer = (id) => {
  return CustomerIncome.findOne({ customer: id });
};

export const update = (id, data) => {
  return CustomerIncome.updateOne({ company: id }, { $set: data });
};
