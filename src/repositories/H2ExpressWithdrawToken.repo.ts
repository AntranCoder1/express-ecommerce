import { H2ExpressWithdrawToken } from "../models/H2ExpressWithdrawToken.model";

export const createWithdrawToken = (data: any) => {
  const newWithdrawToken = new H2ExpressWithdrawToken(data);
  return newWithdrawToken.save();
};
