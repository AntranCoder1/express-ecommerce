import { Collaborator } from "../models/collaborator.model";
import { Domain } from "../models/domain.model";
export const collaboratorCreate = async (body: any) => {
  const newCollaborator = new Collaborator(body);
  await newCollaborator.save();
  return newCollaborator._id;
};

export const collaboratorUpdate = async (id: any, body: any) => {
  const modified = await Collaborator.findByIdAndUpdate(id, body);
  return modified._id;
};

export const collaboratorGetHashedPassword = async (emailOrPhone: string) => {
  let collaborator = await Collaborator.findOne({ phoneNumber: emailOrPhone });
  if (!collaborator) {
    collaborator = await Collaborator.findOne({ email: emailOrPhone });
  }
  return collaborator ? collaborator.password : undefined;
};

export const collaboratorGetByEmail = async (email: string) => {
  const fieldSelects = {
    password: 0,
  };
  const result = await Collaborator.findOne({ email }).select(fieldSelects);
  return result;
};

export const collaboratorGetByPhoneNumber = async (phoneNumber: string) => {
  const fieldSelects = {
    password: 0,
  };
  const result = await Collaborator.findOne({ phoneNumber }).select(
    fieldSelects
  );
  return result;
};

export const isCollaboratorFieldAvailable = async (
  fieldName: string,
  fieldValue: any,
  id?: any
) => {
  let collaborator: any;
  switch (fieldName) {
    case "phoneNumber": {
      collaborator = await Collaborator.findOne({ phoneNumber: fieldValue });
      break;
    }
    case "email": {
      collaborator = await Collaborator.findOne({ email: fieldValue });
      break;
    }
  }

  if (!collaborator) {
    return true;
  } else {
    if (id) {
      return id.toString() === collaborator._id.toString();
    } else {
      return false;
    }
  }
};

export const collaboratorGetById = async (id: any) => {
  const fieldsSelect = {
    _id: 1,
    name: 1,
    email: 1,
    phoneNumber: 1,
  };
  const data = await Collaborator.findById(id).select(fieldsSelect);
  return data;
};

export const getAllDomain = () => {
  const result = Domain.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$status", "active"],
        },
      },
    },
    {
      $lookup: {
        from: "domain_products",
        let: {
          domain_id: "$_id",
          is_commission: true,
          commission_percent: 0,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$domain_id", "$domain"] },
                  { $eq: ["$$is_commission", "$isCommission"] },
                  { $lt: ["$$commission_percent", "$commissionPercent"] },
                ],
              },
            },
          },
        ],
        as: "domainProduct",
      },
    },
    {
      $project: {
        logo: 1,
        name: 1,
        websiteAddress: 1,
        _id: 1,
        phoneNumber: 1,
        status: 1,
        marketer: 1,
        countProduct: { $size: "$domainProduct" },
        domainProduct: 1,
      },
    },
  ]);
  return result;
};
