import { CollaboratorIncome } from "../models/collaboratorIncome.model";
import mongoose from "mongoose";

export const createCollaboratorIncome = (id) => {
  const collabIncome = new CollaboratorIncome({
    collaborator: id,
  });
  return collabIncome.save();
};

export const updateCollabIncome = (id, data) => {
  return CollaboratorIncome.updateOne({ collaborator: id }, { $set: data });
};

export const getByCollaborator = (id) => {
  return CollaboratorIncome.findOne({ collaborator: id }).populate({
    path: "collaborator",
    model: "Collaborator",
    select: { _id: 1, name: 1, phoneNumber: 1, email: 1 },
  });
};

export const update = (id, data) => {
  return CollaboratorIncome.updateOne({ collaborator: id }, { $set: data });
};
