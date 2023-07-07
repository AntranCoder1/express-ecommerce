import { OrderDetail } from "../models/orderDetail.model";
import mongoose from "mongoose";

export const orderDetailCreate = async (body: any) => {
  const arrProduct = [];
  for (const i of body.items) {
    const product = new OrderDetail({
      order: body.order,
      product_domain: i.product_domain,
      product_version: i.product_version,
      quantity: i.quantity,
      tokenCollaborator: i.tokenCollaborator,
      price: i.price,
    });
    arrProduct.push(product);
  }
  return OrderDetail.insertMany(arrProduct);
};
export const updateOne = (id, data) => {
  return OrderDetail.updateOne({ _id: id }, { $set: data });
};
export const orderDetailUpdate = async (id: any, body: any) => {
  const modified = await OrderDetail.findByIdAndUpdate(id, body);
  return modified._id;
};
export const orderDetailDelete = async (id: any) => {
  const result = await OrderDetail.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Thông tin chi tiết đơn hàng đã được xóa.";
  } else {
    return "Không có thông tin đơn hàng nào bị xóa.";
  }
};

export const getDetailByOrderId = (id: string) => {
  return OrderDetail.find({ order: id })
    .select({
      _id: 1,
      quantity: 1,
      tokenCollaborator: 1,
      price: 1,
      importPrice: 1,
    })
    .populate({
      path: "product_version",
      model: "ProductVersion",
      select: { _id: 1, attributes: 1, price: 1, image: 1, inStock: 1 },
    })
    .populate({
      path: "product_domain",
      model: "DomainProduct",
      select: { _id: 1, domain_price: 1 },
      populate: {
        path: "product",
        model: "Product",
        select: {
          _id: 1,
          name: 1,
          slug: 1,
          discount: 1,
          isDiscount: 1,
          images: 1,
          inStock: 1,
          importPrice: 1,
        },
      },
    });
};

export const getAllDetailByOrderId = (arr: any) => {
  return OrderDetail.find({ order: { $in: arr } })
    .select({ _id: 1, quantity: 1, order: 1 })
    .populate({
      path: "product_version",
      model: "ProductVersion",
      select: { _id: 1, attributes: 1, price: 1, image: 1 },
    })
    .populate({
      path: "product_domain",
      model: "DomainProduct",
      select: { _id: 1, domain_price: 1 },
      populate: {
        path: "product",
        model: "Product",
        select: {
          _id: 1,
          name: 1,
          slug: 1,
          discount: 1,
          isDiscount: 1,
          images: 1,
        },
      },
    });
};

export const getTotalQuantityByDomain = (arrProduct) => {
  const result = OrderDetail.aggregate([
    {
      $match: {
        $expr: {
          $in: ["$product_domain", arrProduct],
        },
      },
    },
    {
      $lookup: {
        from: "orderes",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $lookup: {
        from: "domain_products",
        let: {
          product_domain_id: "$product_domain",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_domain_id", "$_id"],
              },
            },
          },
          {
            $lookup: {
              from: "products",
              let: {
                product_id: "$product",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$product_id", "$_id"],
                    },
                  },
                },
              ],
              as: "product",
            },
          },
          {
            $project: {
              product: { name: 1, slug: 1, images: 1 },
            },
          },
          { $unwind: "$product" },
        ],
        as: "domain_product",
      },
    },
    { $unwind: "$domain_product" },
    {
      $match: {
        "order.status": new mongoose.Types.ObjectId("6279de7e812ffe6a51cb4aba"),
      },
    },

    {
      $group: {
        _id: "$product_domain",
        quantity: {
          $sum: {
            $toInt: "$quantity",
          },
        },
        revenue: {
          $sum: {
            $multiply: ["$price", "$quantity"],
          },
        },
      },
    },
    {
      $lookup: {
        from: "domain_products",
        let: {
          product_domain_id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_domain_id", "$_id"],
              },
            },
          },
          {
            $lookup: {
              from: "products",
              let: {
                product_id: "$product",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$product_id", "$_id"],
                    },
                  },
                },
              ],
              as: "product",
            },
          },
          {
            $project: {
              product: { name: 1, slug: 1, images: 1 },
            },
          },
          { $unwind: "$product" },
        ],
        as: "domain_product",
      },
    },
    { $unwind: "$domain_product" },
  ]);
  return result;
};
