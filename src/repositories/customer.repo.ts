import { Customer } from "../models/customer.model";
import { Receiver } from "../models/receiver.model";
import mongoose from "mongoose";
import * as fs from "fs";
export const isCustomerFieldAvailable = async (
  fieldName: string,
  fieldValue: any,
  id?: any
) => {
  let customer: any;
  switch (fieldName) {
    case "phoneNumber": {
      customer = await Customer.findOne({ phoneNumber: fieldValue });
      break;
    }
    case "email": {
      customer = await Customer.findOne({ email: fieldValue });
      break;
    }
    case "facebookLoginKey": {
      customer = await Customer.findOne({ facebookLoginKey: fieldValue });
      break;
    }
  }

  if (!customer) {
    return true;
  } else {
    if (id) {
      return id.toString() === customer._id.toString();
    } else {
      return false;
    }
  }
};
export const customerGetById = async (id: any) => {
  return Customer.findOne({ _id: id })
    .select({
      password: 0,
    })
    .populate({
      path: "address.city",
      model: "AreaCity",
      select: "",
    })
    .populate({
      path: "address.district",
      model: "AreaDistrict",
    })
    .populate({
      path: "address.commune",
      model: "AreaCommune",
    });
};
export const customerGetByEmail = async (email: string) => {
  const fieldSelects = {
    password: 0,
  };
  const result = await Customer.findOne({ email }).select(fieldSelects);
  return result;
};
export const customerGetByPhoneNumber = async (phoneNumber: string) => {
  const fieldSelects = {
    password: 0,
  };
  const result = await Customer.findOne({ phoneNumber }).select(fieldSelects);
  return result;
};
export const customerGetHashedPassword = async (emailOrPhone: string) => {
  let customer = await Customer.findOne({ phoneNumber: emailOrPhone });
  if (!customer) {
    customer = await Customer.findOne({ email: emailOrPhone });
  }
  return customer ? customer.password : undefined;
};
export const customerGetFavourites = async (id: any) => {
  const customer: any = await Customer.findOne({ _id: id }).select({
    favourites: 1,
  });
  return customer.favourites;
};
export const customerCreate = async (body: any) => {
  const newCustomer = new Customer(body);
  await newCustomer.save();
  return newCustomer._id;
};
export const customerUpdate = async (id: any, body: any) => {
  const modified = await Customer.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  return modified._id;
};
export const customerDelete = async (id: any) => {
  const customer: any = await Customer.findOne({ _id: id });
  if (customer) {
    // Delete receivers
    if (customer.receivers) {
      await Receiver.deleteMany({ customer: id });
    }
    // Unlink avatar
    if (customer.avatar && customer.avatar.path) {
      fs.unlink(customer.avatar.path, (err) => {
        if (err) {
          console.log("Error when unlink " + customer.avatar.name + ": " + err);
        }
      });
    }
    // Delete customer
    const result = await Customer.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      return "Người dùng đã được xóa.";
    } else {
      return "Không người dùng nào bị xóa.";
    }
  } else {
    throw new Error("Không tìm thấy người dùng để xóa.");
  }
};

export const createAddress = (data, customerId) => {
  return Customer.findOneAndUpdate(
    { _id: customerId },
    { $push: { address: data } },
    { new: true, upsert: true }
  );
};

export const getOne = (id) => {
  return Customer.findOne({ _id: id });
};

export const updateCus = (id, address) => {
  return Customer.updateOne({ _id: id }, { $set: { address } });
};

export const updateAdd = (data, addressId) => {
  return Customer.updateOne(
    { "address._id": addressId },
    { $set: { "address.$": data } }
  );
};

export const removeAdd = (customerId, addressId) => {
  return Customer.updateOne(
    { _id: customerId },
    { $pull: { address: { _id: new mongoose.Types.ObjectId(addressId) } } }
  );
};

export const findByFaceId = (uid) => {
  return Customer.findOne({
    facebookLoginKey: uid,
  });
};
