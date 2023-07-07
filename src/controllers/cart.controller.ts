import { Request, Response } from "express";
import * as cartRepo from "../repositories/cart.repo";
import * as domainRepo from "../repositories/domain.repo";
import getHostname from "../modules/hostname.module";
export const getAll = async (req: Request, res: Response) => {
  try {
    const customer = req.body.user._id;
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const getCart = await cartRepo.getAll(customer, getDomain._id);
    if (getCart.length === 0) {
      const createC = await cartRepo.createCart(customer, getDomain._id, []);
      if (createC) {
        res.status(200).send({ status: "success", data: createC });
      } else {
        res.status(400).send({ status: "failed" });
      }
    } else {
      res.status(200).send({ status: "success", data: getCart[0] });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const customer = req.body.user._id;
    const item = req.body.item;
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const updateCarts = await cartRepo.updateC(getDomain._id, customer, item);
    if (updateCarts) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createCart = async (req: Request, res: Response) => {
  try {
    const customer = req.body.user._id;
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const updateCarts = await cartRepo.createCart(customer, getDomain._id, []);
    if (updateCarts) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
