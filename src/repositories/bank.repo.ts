import { Bank } from "../models/bank.model";
import { BankSeeds } from "../seeds/bank.seed";
import { BankBranch } from "../models/bankBranch.model";
import { bankBranchCreate } from "../repositories/bankBranch.repo";

export const bankCreate = async (body: any) => {
  const newBank = new Bank(body);
  await newBank.save();
  return newBank._id;
};
export const bankUpdate = async (id: any, body: any) => {
  const modified = await Bank.findByIdAndUpdate(id, body);
  return modified;
};
export const bankDelete = async (id: any) => {
  const result = await Bank.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Ngân hàng đã được xóa.";
  } else {
    return "Không có ngân hàng nào bị xóa.";
  }
};
export const bankGetList = async () => {
  const result = await Bank.find();
  return result;
};
export const bankSeed = async () => {
  await Bank.deleteMany();
  await BankBranch.deleteMany();
  for (const bank of BankSeeds) {
    const bankId = await bankCreate({ name: bank.name });
    for (const branch of bank.branchs) {
      await bankBranchCreate({ bank: bankId, name: branch.name });
    }
  }
};
