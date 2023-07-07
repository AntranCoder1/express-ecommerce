import { Request, Response } from "express";
import * as reviewRepo from "../repositories/review.repo";
import * as productRepo from "../repositories/product.repo";
import * as orderRepo from "../repositories/order.repo";
import * as productVersionRepo from "../repositories/productVersion.repo";
import mongoose from "mongoose";

export const createReviewCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const orderId = req.body.orderId;
    const arrProduct = req.body.arrProduct;
    const domainId = req.body.domainId;

    for (const i of arrProduct) {
      const domainProduct = await productRepo.findDomainProduct(i.productId);

      const domainProductId = domainProduct[0].domainProduct[0]._id;

      const findMaketer = await orderRepo.orderGetById(orderId);

      const data = {
        orderId,
        productId: i.productId,
        domainProductId,
        domainId,
        customerId,
        maketerId: findMaketer[0].marketer._id,
        star: i.star,
        comment: i.contentComment,
        titleComment: i.titleComment,
        count: 1,
      };

      const create = await reviewRepo.createReview(data);
    }

    res.status(200).send({ status: "success", rated: true });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const findAllReviewWithOrderId = async (req: Request, res: Response) => {
  try {
    const orderId = req.body.orderId;

    const reviews = await reviewRepo.findAll({ orderId });

    const arrId = [];
    for (const i of reviews) {
      arrId.push(new mongoose.Types.ObjectId(i.productId));
    }

    const productVersionData = await productVersionRepo.findWithProductId(
      arrId
    );

    for (const i of reviews) {
      i.productVersion = [];
      for (const j of productVersionData) {
        if (i.productId.valueOf() === j.product.valueOf()) {
          i.productVersion.push(j);
        }
      }
    }
    if (reviews) {
      res.status(200).send({ status: "success", data: reviews });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const findAllReviewWithDomainId = async (
  req: Request,
  res: Response
) => {
  try {
    const domainId = req.body.domainId;

    const reviews = await reviewRepo.findAll({ domainId });

    if (reviews) {
      res.status(200).send({ status: "success", data: reviews });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const findAllReviewWithDomainProductId = async (
  req: Request,
  res: Response
) => {
  try {
    const domainProductId = req.body.domainProductId;

    const reviews = await reviewRepo.findAll({ domainProductId });

    if (reviews) {
      res.status(200).send({ status: "success", data: reviews });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const orderId = req.body.orderId;
    const arrProduct = req.body.arrProduct;
    const domainId = req.body.domainId;

    for (const i of arrProduct) {
      const domainProduct = await productRepo.findDomainProduct(i.productId);

      const domainProductId = domainProduct[0].domainProduct[0]._id;

      const findMaketer = await orderRepo.orderGetById(orderId);

      const findReview = await reviewRepo.findById(i.reviewId);

      if (findReview) {
        if (findReview.count === 2) {
          return res.status(400).send({
            status: "failed",
            message: "Bạn đã vượt quá số lần đánh giá sản phầm",
          });
        } else {
          const data = {
            orderId,
            productId: i.productId,
            domainProductId,
            domainId,
            customerId,
            maketerId: findMaketer[0].marketer._id,
            star: i.star,
            comment: i.contentComment,
            titleComment: i.titleComment,
            count: 2,
          };

          const editReview = await reviewRepo.editReview(i.reviewId, data);
        }
      } else {
        res.status(400).send({ status: "failed", message: "Review not found" });
      }
    }

    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
