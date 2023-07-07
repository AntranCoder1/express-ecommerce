import { Admin } from "../models/admin.model";

export const createAdmin = (body) => {
  const newAdmin = new Admin(body);
  return newAdmin.save();
};

export const getByEmail = async (email: string) => {
  const fieldSelects = {
    password: 0,
  };
  const result = await Admin.findOne({ email }).select(fieldSelects);
  return result;
};

export const adminGetHashedPassword = async (email: string) => {
  const admin = await Admin.findOne({ email });
  return admin ? admin.password : undefined;
};

export const getOne = async (id: string) => {
  return await Admin.findOne({ _id: id }).select({
    name: 1,
    email: 1,
    avatar: 1,
  });
};
