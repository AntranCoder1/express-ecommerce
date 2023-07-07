import { Event } from "../models/event.model";
import mongoose from "mongoose";

export const createEvent = (data) => {
  const event = new Event({
    domain: data.domain,
    title: data.title,
    slug: data.slug,
    banner: data.banner,
    start_time: new Date(data.start_time).getTime(),
    finish_time: new Date(data.finish_time).getTime(),
    description: data.description,
  });
  return event.save();
};

export const updateEvent = (id, data) => {
  return Event.updateOne({ _id: id }, { $set: { data } });
};

export const deleteEvent = (id) => {
  return Event.deleteOne({ _id: id });
};

export const addNewProduct = (id, data) => {
  return Event.findOneAndUpdate(
    { _id: id },
    { $push: { product: data } },
    { new: true, upsert: true }
  );
};

export const removeProduct = (eventId, productId) => {
  return Event.updateOne(
    { _id: eventId },
    { $pull: { product: { _id: new mongoose.Types.ObjectId(productId) } } }
  );
};

export const getEvent = (domain, name) => {
  return Event.find({ domain });
};

export const getImageEvents = (domain) => {
  return Event.find({ domain }).select({ banner: 1 });
};
