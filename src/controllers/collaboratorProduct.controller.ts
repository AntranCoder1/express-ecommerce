import { Request, Response } from "express";
import * as collaboratorProductRepo from "../repositories/collaboratorProduct.repo";
import { v4 as uuidv4 } from "uuid";
export const createCollaboratorProduct = async (
  req: Request,
  res: Response
) => {
  const collaborator = req.body.user._id;
  const domain = req.body.domainId;
  const domainProduct = req.body.domainProductId;
  try {
    const checkCollabProduct =
      await collaboratorProductRepo.checkCollaboratorProduct(
        collaborator,
        domainProduct
      );
    if (checkCollabProduct === 1) {
      throw new Error("Sản phẩm đã được tạo");
    }
    const token = uuidv4();
    const data = {
      collaborator,
      domain,
      domainProduct,
      token,
    };
    const createCollabProduct =
      await collaboratorProductRepo.createCollaboratorProduct(data);
    if (createCollabProduct) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getProductByCollaboratorDomainId = async (
  req: Request,
  res: Response
) => {
  const collaborator = req.body.user._id;
  const domainId = req.body.domainId;
  try {
    const getProduct = await collaboratorProductRepo.getProductDomain(
      collaborator,
      domainId
    );
    if (getProduct) {
      res.status(200).json({ status: "success", data: getProduct });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  const collaborator = req.body.user._id;
  try {
    const getAP = await collaboratorProductRepo.getAllProduct(collaborator);
    if (getAP) {
      res.status(200).json({ status: "success", data: getAP });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getListByDomain = async (req: Request, res: Response) => {
  try {
    const result = await collaboratorProductRepo.dp_getListByDomain(
      req.params.id
    );
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
