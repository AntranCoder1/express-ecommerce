import { BankBranch } from "../models/bankBranch.model";
export const bankBranchCreate = async (body: any) => {
  const newBranch = await new BankBranch(body);
  newBranch.save();
  return newBranch._id;
};
export const bankBranchUpdate = async (id: any, body: any) => {
  const modified = await BankBranch.findByIdAndUpdate(id, body);
  return modified._id;
};
export const bankBranchDelete = async (id: any) => {
  const result = await BankBranch.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Chi nhánh ngân hàng đã được xóa.";
  } else {
    return "Không chi nhánh ngân hàng nào bị xóa.";
  }
};
export const bankBranchGetList = async (bankId: any) => {
  const result = await BankBranch.find({ bank: bankId });
  return result;
};
