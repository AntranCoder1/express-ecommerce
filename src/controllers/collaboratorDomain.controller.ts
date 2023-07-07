import { Request, Response } from "express";
import * as collaboratorDomainRepo from "../repositories/collaboratorDomain.repo";

export const addCollaboratorDomain = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const collaborator = req.body.user._id;
    const newDomainId = req.body.newDomain;
    const newDomain = await collaboratorDomainRepo.addCollaboratorDomain(
      id,
      collaborator,
      newDomainId
    );
    if (newDomain) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const removeCollaboratorDomain = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const collaborator = req.body.user._id;
    const oldDomainId = req.body.oldDomain;
    const newDomain = await collaboratorDomainRepo.removeCollaboratorDomain(
      id,
      collaborator,
      oldDomainId
    );
    if (newDomain) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
