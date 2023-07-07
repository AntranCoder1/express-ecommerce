import { Order } from "../models/order.model";
import { OrderStatus } from "../models/orderStatus.model";
import mongoose from "mongoose";
export const orderCreate = async (body: any) => {
  const newOrder = new Order(body);
  await newOrder.save();
  return newOrder._id;
};
export const orderUpdate = async (id: any, body: any) => {
  return await Order.findByIdAndUpdate(id, body);
};
export const orderGetById = async (id: any) => {
  const result = await Order.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$_id", new mongoose.Types.ObjectId(id)],
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        let: {
          company_id: "$company",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$company_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $lookup: {
        from: "marketers",
        let: {
          marketer_id: "$marketer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$marketer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "marketer",
      },
    },
    { $unwind: "$marketer" },
    {
      $lookup: {
        from: "domains",
        let: {
          domain_id: "$domain",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$domain_id", "$_id"],
              },
            },
          },
          {
            $project: {
              address: 1,
              name: 1,
              phoneNumber: 1,
              websiteAddress: 1,
            },
          },
        ],
        as: "domain",
      },
    },
    { $unwind: "$domain" },
    {
      $lookup: {
        from: "customers",
        let: {
          customer_id: "$customer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$customer_id", "$_id"],
              },
            },
          },
          {
            $project: { email: 1, fullName: 1, phoneNumber: 1 },
          },
        ],
        as: "customer",
      },
    },
    { $unwind: "$customer" },

    {
      $lookup: {
        from: "order_statuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "deliver_types",
        localField: "shipping.type",
        foreignField: "_id",
        as: "shipping.type",
      },
    },
    { $unwind: "$shipping.type" },
    {
      $lookup: {
        from: "delivers",
        localField: "shipping.unit",
        foreignField: "_id",
        as: "shipping.unit",
      },
    },
    { $unwind: "$shipping.unit" },
  ]);
  return result;
};
export const orderGetByIdCompany = async (id: any) => {
  const result = await Order.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$_id", new mongoose.Types.ObjectId(id)],
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        let: {
          company_id: "$company",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$company_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $lookup: {
        from: "marketers",
        let: {
          marketer_id: "$marketer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$marketer_id", "$_id"],
              },
            },
          },
          {
            $project: { _id: 1, email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "marketer",
      },
    },
    { $unwind: "$marketer" },
    {
      $lookup: {
        from: "domains",
        let: {
          domain_id: "$domain",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$domain_id", "$_id"],
              },
            },
          },
          {
            $project: {
              address: 1,
              name: 1,
              phoneNumber: 1,
              websiteAddress: 1,
            },
          },
        ],
        as: "domain",
      },
    },
    { $unwind: "$domain" },
    {
      $lookup: {
        from: "customers",
        let: {
          customer_id: "$customer",
          is_company_Buy: "$isCompanyBuy",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$customer_id", "$_id"],
              },
            },
          },
          {
            $project: {
              email: {
                $cond: {
                  if: { $eq: ["$$is_company_Buy", 1] },
                  then: "$email",
                  else: 0,
                },
              },
              fullName: {
                $cond: {
                  if: { $eq: ["$$is_company_Buy", 1] },
                  then: "$fullName",
                  else: 0,
                },
              },
              phoneNumber: {
                $cond: {
                  if: { $eq: ["$$is_company_Buy", 1] },
                  then: "$phoneNumber",
                  else: 0,
                },
              },
            },
          },
        ],
        as: "customer",
      },
    },
    { $unwind: "$customer" },

    {
      $lookup: {
        from: "order_statuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "deliver_types",
        localField: "shipping.type",
        foreignField: "_id",
        as: "shipping.type",
      },
    },
    { $unwind: "$shipping.type" },
    {
      $lookup: {
        from: "delivers",
        localField: "shipping.unit",
        foreignField: "_id",
        as: "shipping.unit",
      },
    },
    { $unwind: "$shipping.unit" },
    {
      $project: {
        company: 1,
        marketer: 1,
        domain: 1,
        customer: 1,
        status: 1,
        receiver: {
          $cond: {
            if: { $eq: ["$isCompanyBuy", 1] },
            then: "$receiver",
            else: 0,
          },
        },
        "shipping.type": 1,
        "shipping.unit": 1,
        createdAt: 1,
        updatedAt: 1,
        totalPrice: 1,
        refund: 1,
        promos: 1,
        payment: 1,
        isCompanyBuy: 1,
      },
    },
  ]);
  return result;
};

export const orderGetListByCompany = async (companyId: any) => {
  const result = await Order.find({ company: companyId })
    .populate({
      path: "marketer",
      select: "name",
    })
    .populate({
      path: "domain",
      select: "name websiteAddress",
    })
    .populate({
      path: "customer",
      select: "fullName",
    })
    .populate("promos")
    .populate("shipping")
    .populate("status")
    .populate("refund")
    .select({ receiver: 0 })
    .sort({ createdAt: -1 });
  return result;
};
export const orderGetListByMarketer = async (marketerId: any) => {
  const result = await Order.find({ marketer: marketerId })
    .populate({
      path: "company",
      select: "name",
    })
    .populate({
      path: "domain",
      select: "name websiteAddress",
    })
    .populate({
      path: "customer",
      select: "fullName phoneNumber",
    })
    .populate("promos")
    .populate("shipping")
    .populate("status")
    .populate("refund")
    .sort({ createdAt: -1 });
  return result;
};
export const orderGetListByCustomer = async (
  customerId: any,
  domain: any,
  status: any
) => {
  const query = [
    { $eq: ["$customer", new mongoose.Types.ObjectId(customerId)] },
    { $eq: ["$domain", new mongoose.Types.ObjectId(domain)] },
  ];
  if (status !== "") {
    query.push({ $eq: ["$status", new mongoose.Types.ObjectId(status)] });
  }
  const result = await Order.aggregate([
    {
      $match: {
        $expr: {
          $and: query,
        },
      },
    },
    { $project: { isCompanyBuy: 0 } },
    {
      $lookup: {
        from: "order_statuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "deliver_types",
        localField: "shipping.type",
        foreignField: "_id",
        as: "shipping.type",
      },
    },
    { $unwind: "$shipping.type" },
    {
      $lookup: {
        from: "delivers",
        localField: "shipping.unit",
        foreignField: "_id",
        as: "shipping.unit",
      },
    },
    { $unwind: "$shipping.unit" },
    { $sort: { createdAt: -1 } },
  ]);
  return result;
};
export const orderGetStatus = async (id: any) => {
  const order: any = await Order.findOne({ _id: id })
    .select({ status: 1 })
    .populate({
      path: "status",
      select: "keyword",
    });
  return order.status.keyword;
};
export const orderDelete = async (id: any) => {
  const result = await Order.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Đơn hàng đã được xóa.";
  } else {
    return "Không có đơn hàng nào bị xóa.";
  }
};

export const getAllStatus = async () => {
  const result = await OrderStatus.aggregate([
    {
      $match: {
        $expr: {},
      },
    },
  ]);
  return result;
};

export const getCountOrder = (id, domain, customer) => {
  return Order.countDocuments({ domain, customer, status: id });
};

export const orderByMarketer = async (marketer) => {
  const orderQuery = [];
  orderQuery.push({
    $eq: ["$marketer", new mongoose.Types.ObjectId(marketer)],
  });
  const query: any = [
    {
      $match: {
        $expr: {
          $and: orderQuery,
        },
      },
    },
    {
      $lookup: {
        from: "companies",
        let: {
          company_id: "$company",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$company_id", "$_id"],
              },
            },
          },
          {
            $project: { email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $lookup: {
        from: "marketers",
        let: {
          marketer_id: "$marketer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$marketer_id", "$_id"],
              },
            },
          },
          {
            $project: { email: 1, name: 1, phoneNumber: 1 },
          },
        ],
        as: "marketer",
      },
    },
    { $unwind: "$marketer" },
    {
      $lookup: {
        from: "domains",
        let: {
          domain_id: "$domain",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$domain_id", "$_id"],
              },
            },
          },
          {
            $project: {
              address: 1,
              name: 1,
              phoneNumber: 1,
              websiteAddress: 1,
            },
          },
        ],
        as: "domain",
      },
    },
    { $unwind: "$domain" },
    {
      $lookup: {
        from: "customers",
        let: {
          customer_id: "$customer",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$customer_id", "$_id"],
              },
            },
          },
          {
            $project: { email: 1, fullName: 1, phoneNumber: 1 },
          },
        ],
        as: "customer",
      },
    },
    { $unwind: "$customer" },

    {
      $lookup: {
        from: "order_statuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "deliver_types",
        localField: "shipping.type",
        foreignField: "_id",
        as: "shipping.type",
      },
    },
    { $unwind: "$shipping.type" },
    {
      $lookup: {
        from: "delivers",
        localField: "shipping.unit",
        foreignField: "_id",
        as: "shipping.unit",
      },
    },
    { $unwind: "$shipping.unit" },
  ];

  const result = await Order.aggregate(query);
  return result;
};

export const getOrderByCustomer = async (customerId: any, status: any) => {
  const query = [
    { $eq: ["$customer", new mongoose.Types.ObjectId(customerId)] },
  ];
  if (status !== "") {
    query.push({ $eq: ["$status", new mongoose.Types.ObjectId(status)] });
  }
  const result = await Order.aggregate([
    {
      $match: {
        $expr: {
          $and: query,
        },
      },
    },
    { $project: { isCompanyBuy: 0 } },
    {
      $lookup: {
        from: "order_statuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
    { $unwind: "$status" },
    {
      $lookup: {
        from: "deliver_types",
        localField: "shipping.type",
        foreignField: "_id",
        as: "shipping.type",
      },
    },
    { $unwind: "$shipping.type" },
    {
      $lookup: {
        from: "delivers",
        localField: "shipping.unit",
        foreignField: "_id",
        as: "shipping.unit",
      },
    },
    { $unwind: "$shipping.unit" },
    { $sort: { createdAt: -1 } },
  ]);
  return result;
};
