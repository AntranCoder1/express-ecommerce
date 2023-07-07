import { Deliver } from "../models/deliver.model";
import { deliverSeeds } from "../seeds/delivers.seed";
export const d_list = async () => {
  return await Deliver.find();
};
export const d_create = async (body: any) => {
  const newDeliver = new Deliver(body);
  await newDeliver.save();
  return newDeliver._id;
};
export const d_update = async (id: any, body: any) => {
  const modified = await Deliver.findByIdAndUpdate(id, body);
  return modified._id;
};
export const d_delete = async (id: any) => {
  await Deliver.deleteOne({ _id: id });
};
export const d_seed = async () => {
  for (const seed of deliverSeeds) {
    const deliver = await Deliver.findOne({ name: seed.name });
    if (!deliver || deliver === null) {
      await d_create(seed);
    }
  }
};
