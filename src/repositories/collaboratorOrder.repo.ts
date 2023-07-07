import { CollaboratorOrder } from "../models/collaboratorOrder.model";
import mongoose from "mongoose";

export const createCollaboratorOrder = (body) => {
  const collabOrder = new CollaboratorOrder(body);
  return collabOrder.save();
};

export const getByCollaborator = async (
  collaborator,
  domain,
  status,
  startDate,
  finishDate
) => {
  const collaboratorQuery = [];
  collaboratorQuery.push({
    $eq: ["$collaborator", new mongoose.Types.ObjectId(collaborator)],
  });
  if (!!startDate && !!finishDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(finishDate);

    endDateTime.setHours(23, 59, 59, 999);

    collaboratorQuery.push({
      $and: [
        { $gte: ["$createdAt", startDateTime] },
        { $lte: ["$createdAt", endDateTime] },
      ],
    });
  }
  if (!!domain) {
    collaboratorQuery.push({
      $eq: ["$domain", new mongoose.Types.ObjectId(domain)],
    });
  }
  const query: any = [
    {
      $match: {
        $expr: {
          $and: collaboratorQuery,
        },
      },
    },
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
            $project: { _id: 1, name: 1, websiteAddress: 1, logo: 1 },
          },
        ],
        as: "domain",
      },
    },
    { $unwind: "$domain" },
    {
      $lookup: {
        from: "orderes",
        let: {
          order_id: "$order",
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

    { $unwind: "$order" },
    {
      $lookup: {
        from: "order_details",
        let: {
          order_detail_id: "$orderDetail",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$order_detail_id", "$_id"],
              },
            },
          },
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
                { $unwind: "$product" },

                {
                  $lookup: {
                    from: "domain_categories",
                    let: { categoryId: "$domain_category" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$$categoryId", "$_id"],
                          },
                        },
                      },
                      {
                        $project: {
                          name: 1,
                          slug: 1,
                        },
                      },
                    ],
                    as: "domain_category",
                  },
                },
                {
                  $lookup: {
                    from: "domain_sub_categories",
                    let: { subCategoryId: "$domain_subCategory" },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$$subCategoryId", "$_id"],
                          },
                        },
                      },
                      {
                        $project: {
                          name: 1,
                          slug: 1,
                        },
                      },
                    ],
                    as: "domain_subCategory",
                  },
                },
              ],
              as: "domain_product",
            },
          },
          {
            $lookup: {
              from: "product_versions",
              let: {
                productVersionId: "$product_version",
              },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$$productVersionId", "$_id"] },
                  },
                },
                { $project: { price: 0, product: 0, inStock: 0 } },
              ],
              as: "product_version",
            },
          },
          {
            $project: {
              _id: 1,
              quantity: 1,
              order: 1,
              product_version: 1,
              domain_product: {
                _id: 1,
                domain_price: 1,
                domain_category: 1,
                domain_subCategory: 1,
                isCommission: 1,
                commissionPercent: 1,
                product: {
                  _id: 1,
                  name: 1,
                  slug: 1,
                  discount: 1,
                  isDiscount: 1,
                  images: 1,
                },
              },
            },
          },
          { $unwind: "$domain_product" },
        ],
        as: "orderDetail",
      },
    },
    { $unwind: "$orderDetail" },
  ];
  if (status) {
    query.push({
      $match: {
        "order.status": new mongoose.Types.ObjectId(status),
      },
    });
  }
  const result = await CollaboratorOrder.aggregate(query);
  return result;
};

export const getByOrder = (order) => {
  return CollaboratorOrder.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$order", new mongoose.Types.ObjectId(order)],
        },
      },
    },
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
            $project: { _id: 1, name: 1 },
          },
        ],
        as: "domain",
      },
    },
    { $unwind: "$domain" },
    {
      $lookup: {
        from: "order_details",
        let: {
          order_detail_id: "$orderDetail",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$order_detail_id", "$_id"],
              },
            },
          },
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
              ],
              as: "domain_product",
            },
          },
          {
            $project: {
              _id: 1,
              domain_product: {
                _id: 1,
                isCommission: 1,
                commissionPercent: 1,
              },
            },
          },
          { $unwind: "$domain_product" },
        ],
        as: "orderDetail",
      },
    },
    { $unwind: "$orderDetail" },
  ]);
};
