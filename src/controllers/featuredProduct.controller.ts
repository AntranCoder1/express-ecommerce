import { Request, Response } from "express";
import * as featuredProductRepo from "../repositories/featuredProduct.repo";
import * as domainRepo from "../repositories/domain.repo";
import mongoose from "mongoose";
export const getAll = async (req: Request, res: Response) => {
  const domainStr = req.query.slug as string;
  const offset = req.query.offset;
  const page = req.query.page;
  try {
    const getDomain: any = await domainRepo.domainGetByAddress(domainStr);
    if (!getDomain) {
      throw new Error("Không tìm thấy " + domainStr);
    }

    const product = await featuredProductRepo.getAll(
      getDomain._id,
      offset,
      page
    );
    const count = await featuredProductRepo.countAll(getDomain._id);
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
  try {
    const product = await featuredProductRepo.getAllP(domain);
    const count = await featuredProductRepo.countAll(domain);
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
  const arrProduct = req.body.arrProduct;
  try {
    const product = await featuredProductRepo.create(domain, arrProduct);
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
  try {
    const product = await featuredProductRepo.getAllP(domain);
    const arrCurrentProduct = [];
    for (const i of product) {
      const id = i.domainProductId._id;
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
      const addProduct = await featuredProductRepo.create(
        domain,
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
        const removeProduct = await featuredProductRepo.removeProducts(
          domain,
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
