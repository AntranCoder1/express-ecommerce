import { Request, Response } from "express";
import * as productLinkDomainRepo from "../repositories/product-link-domain.repo";
import * as domainRepo from "../repositories/domain.repo";
export const getAll = async (req: Request, res: Response) => {
  const domainStr = req.query.slug as string;
  const linkDomain = req.query.linkDomain as string;
  const offset = req.query.offset;
  const page = req.query.page;
  try {
    const getDomain: any = await domainRepo.domainGetByAddress(domainStr);
    if (!getDomain) {
      throw new Error("Không tìm thấy " + domainStr);
    }
    const product = await productLinkDomainRepo.getAll(
      getDomain._id,
      linkDomain,
      offset,
      page
    );
    const count = await productLinkDomainRepo.countAll(
      getDomain._id,
      linkDomain
    );
    if (product) {
      res.status(200).send({ status: "success", product, total: count });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  const domain = req.query.domain as string;
  const linkDomain = req.query.linkDomain as string;
  try {
    const product = await productLinkDomainRepo.getAllP(domain, linkDomain);
    const count = await productLinkDomainRepo.countAll(domain, linkDomain);
    if (product) {
      res.status(200).send({ status: "success", product, total: count });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const linkDomain = req.body.linkDomain;
  const arrProduct = req.body.arrProduct;
  try {
    const product = await productLinkDomainRepo.create(
      domain,
      linkDomain,
      arrProduct
    );
    if (product) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const arrProduct = req.body.arrProduct;
  const linkDomain = req.body.linkDomain;
  try {
    const product = await productLinkDomainRepo.getAllP(domain, linkDomain);
    const arrCurrentProduct = [];
    for (const i of product) {
      const id = i.linkDomainProductId._id;
      arrCurrentProduct.push(id.valueOf());
    }
    const arrRemoveProduct = [];
    const arrAddProduct = [];
    for (const i of arrProduct) {
      if (arrCurrentProduct.indexOf(i) < 0) {
        arrAddProduct.push(i);
      }
    }
    for (const i of arrCurrentProduct) {
      if (arrProduct.indexOf(i) < 0) {
        arrRemoveProduct.push(i);
      }
    }
    let isAdd = false;
    if (arrAddProduct.length > 0) {
      const addProduct = await productLinkDomainRepo.create(
        domain,
        linkDomain,
        arrAddProduct
      );
      isAdd = true;
    } else {
      isAdd = true;
    }
    let isRemove = false;
    if (arrRemoveProduct.length > 0) {
      let countR = 0;
      for (const i of arrRemoveProduct) {
        const removeProduct = await productLinkDomainRepo.removeProducts(
          domain,
          linkDomain,
          i
        );
        countR++;
      }
      if (countR === arrRemoveProduct.length) {
        isRemove = true;
      }
    } else {
      isRemove = true;
    }
    if (isAdd && isRemove) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getDomainInfo = async (req: Request, res: Response) => {
  const linkDomain = req.params.id;
  try {
    const getDomains = await domainRepo.domainGetById(linkDomain);
    if (getDomains) {
      res.status(200).send({ status: "success", data: getDomains });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
