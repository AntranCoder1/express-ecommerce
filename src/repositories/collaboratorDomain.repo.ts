import { CollaboratorDomain } from "../models/collaboratorDomain.model";
import mongoose from "mongoose";

export const createCollaboratorDomain = (collaborator) => {
  const newCompany = new CollaboratorDomain({
    collaborator,
    domain: [],
  });
  return newCompany.save();
};
export const addCollaboratorDomain = (id, collaborator, newDomain) => {
  return CollaboratorDomain.updateOne(
    {
      _id: id,
      collaborator,
    },
    { $push: { domain: new mongoose.Types.ObjectId(newDomain) } }
  );
};

export const removeCollaboratorDomain = (id, collaborator, oldDomain) => {
  return CollaboratorDomain.updateOne(
    {
      _id: id,
      collaborator,
    },
    { $pull: { domain: new mongoose.Types.ObjectId(oldDomain) } }
  );
};
