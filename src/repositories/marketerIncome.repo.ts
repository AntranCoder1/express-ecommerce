import { MarketerIncome } from "../models/marketerIncome.model";
import mongoose from "mongoose";

export const createMarketerIncome = (id, domain) => {
  const marketerIncomes = new MarketerIncome({
    marketer: id,
    domain,
  });
  return marketerIncomes.save();
};

export const updateMarketerIncomeByMarketer = (id, data) => {
  return MarketerIncome.updateOne({ marketer: id }, { $set: data });
};

export const updateMarketerIncomeByDomain = (id, data) => {
  return MarketerIncome.updateOne({ domain: id }, { $set: data });
};

export const getByMarketerDomain = (id, domain) => {
  return MarketerIncome.findOne({ marketer: id, domain });
};

export const getByDomain = (domain) => {
  return MarketerIncome.findOne({ domain });
};

export const getByMarketer = (id) => {
  return MarketerIncome.findOne({ marketer: id });
};

export const update = (id, data) => {
  return MarketerIncome.updateOne({ marketer: id }, { $set: data });
};
