import mongoose from "mongoose";
import { Review } from "../models/review.model";

export const createReview = (data: any) => {
  const newReview = new Review(data);
  return newReview.save();
};

export const findAll = async (data: any) => {
  const reviewQuery = [];
  if (!!data.productId) {
    reviewQuery.push({
      $eq: ["$productId", new mongoose.Types.ObjectId(data.productId)],
    });
  }

  if (!!data.maketerId) {
    reviewQuery.push({
      $eq: ["$maketerId", new mongoose.Types.ObjectId(data.maketerId)],
    });
  }

  if (!!data.orderId) {
    reviewQuery.push({
      $eq: ["$orderId", new mongoose.Types.ObjectId(data.orderId)],
    });
  }

  if (!!data.domainId) {
    reviewQuery.push({
      $eq: ["$domainId", new mongoose.Types.ObjectId(data.domainId)],
    });
  }

  if (!!data.domainProductId) {
    reviewQuery.push({
      $eq: [
        "$domainProductId",
        new mongoose.Types.ObjectId(data.domainProductId),
      ],
    });
  }

  const query: any = [
    {
      $match: {
        $expr: {
          $and: reviewQuery,
        },
      },
    },
    {
      $lookup: {
        from: "domains",
        let: {
          domain_id: "$domainId",
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
            $project: { _id: 1, name: 1, websiteAddress: 1, logo: 1 },
          },
        ],
        as: "domain",
      },
    },
    {
      $lookup: {
        from: "orderes",
        let: {
          order_id: "$orderId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$order_id", "$_id"],
              },
            },
          },
          {
            $lookup: {
              from: "order_statuses",
              localField: "status",
              foreignField: "_id",
              as: "orderStatus",
            },
          },
          {
            $project: {
              _id: 1,
              createdAt: 1,
              updatedAt: 1,
              status: 1,
              orderStatus: { keyword: 1, name: 1, _id: 1 },
            },
          },

          { $unwind: "$orderStatus" },
        ],
        as: "order",
      },
    },

    {
      $lookup: {
        from: "customers",
        let: {
          customer_id: "$customerId",
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
              _id: 1,
              fullname: 1,
              phoneNumber: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "products",
        let: {
          product_id: "$productId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_id", "$_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              images: 1,
            },
          },
        ],
        as: "product",
      },
    },
    {
      $lookup: {
        from: "marketers",
        let: {
          maketer_id: "$maketerId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$maketer_id", "$_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        ],
        as: "maketer",
      },
    },
  ];

  const result = await Review.aggregate(query);
  return result;
};

export const findById = (reviewId: string) => {
  return Review.findById(reviewId);
};

export const editReview = (reviewId: string, data: any) => {
  return Review.updateOne({ _id: reviewId }, data);
};

export const findAllReviewByOrderId = (arr: any) => {
  return Review.find({ orderId: { $in: arr } }).select({
    _id: 1,
    orderId: 1,
    customerId: 1,
  });
};
