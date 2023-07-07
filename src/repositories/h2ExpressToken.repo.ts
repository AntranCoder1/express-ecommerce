import { H2ExpressToken } from "../models/h2ExpressToken.models";

export const createToken = (data: any) => {
  const newToken = new H2ExpressToken(data);
  return newToken.save();
};

export const upateToken = (token: number) => {
  return H2ExpressToken.updateOne({ isAdmin: true }, { token });
};

export const findToken = () => {
  return H2ExpressToken.find();
};
