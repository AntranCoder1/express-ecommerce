import mongoose from "mongoose";
import { PromoCode } from "../models/promoCode.model";
import { PromoCodeDetail } from "../models/promoCodeDetail.model";
export const pc_listByMarketer = async (id: any) => {
  return await PromoCode.find({ marketer: id });
};
export const pc_getById = async (id: any) => {
  return await PromoCode.findById(id).populate("marketer").populate("detail");
};
export const pc_create = async (body: any) => {
  const detailDocument = new PromoCodeDetail({
    discountType: body.discountType,
    discountAmount: body.discountAmount,
    productType: body.productType,
    productList: body.productList ? body.productList : [],
  });
  await detailDocument.save();
  const detailId = detailDocument._id;
  const promoDocument = new PromoCode({
    domain: body.domain,
    name: body.name,
    limit: body.limit,
    startAt: body.startAt,
    endAt: body.endAt,
    description: body.description,
    detail: detailId,
  });
  await promoDocument.save();
  return promoDocument._id;
};

export const checkCode = (code, domain) => {
  return PromoCode.find({
    $and: [
      {
        domain,
      },
      { name: new RegExp(code, "i"), codeVerify: null },
    ],
  })
    .select({
      _id: 1,
      name: 1,
      startAt: 1,
      endAt: 1,
    })
    .populate({
      path: "detail",
      model: "PromoCodeDetail",
    });
};

export const pc_update = async (id: any, body: any) => {
  const promoDocument = await PromoCode.findById(id);
  return "work later";
};
