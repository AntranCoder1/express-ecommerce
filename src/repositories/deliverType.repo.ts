import { DeliverType } from "../models/deliverType.model";
import { deliverTypeSeeds } from "../seeds/deliverType.seed";
export const dt_list = async () => {
  return await DeliverType.find();
};
export const isKeywordAvailable = async (keyword: string, id?: any) => {
  const deliverType = await DeliverType.findOne({ keyword });
  if (!deliverType || deliverType === null) {
    return true;
  } else {
    if (!id) {
      return false;
    } else {
      return id.toString() === deliverType._id.toString();
    }
  }
};
export const dt_create = async (body: any) => {
  const newDT = new DeliverType(body);
  await newDT.save();
  return newDT._id;
};
export const dt_update = async (id: any, body: any) => {
  const modified = await DeliverType.findByIdAndUpdate(id, body);
  return modified._id;
};
export const dt_delete = async (id: any) => {
  await DeliverType.deleteOne({ _id: id });
};
export const dt_seed = async () => {
  for (const seed of deliverTypeSeeds) {
    const deliverType = await DeliverType.findOne({ keyword: seed.keyword });
    if (!deliverType || deliverType === null) {
      await dt_create(seed);
    }
  }
};
