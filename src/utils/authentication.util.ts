import { companyGetByFields } from "../repositories/company.repo";
import { marketerGetByFields } from "../repositories/marketer.repo";
import {
  customerGetByEmail,
  customerGetByPhoneNumber,
} from "../repositories/customer.repo";
import {
  collaboratorGetByEmail,
  collaboratorGetByPhoneNumber,
} from "../repositories/collaborator.repo";
import { getByEmail } from "../repositories/admin.repo";
import { domainGetFirstByMarketer } from "../repositories/domain.repo";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
export const createAccessToken = async (
  accessRole: string,
  loginValue: string,
  tokenData?: any
) => {
  let accessToken: any;
  // const options = {
  //   expiresIn: "2h",
  // };
  let secretKey: any;
  let data: any = tokenData ? tokenData : undefined;
  switch (accessRole) {
    case "company": {
      // options.expiresIn = "8h";
      secretKey = process.env.SECRET_KEY as string;
      if (!tokenData) {
        const company = await companyGetByFields({ email: loginValue });
        data = {
          isCompany: true,
          role: "company",
          _id: company._id,
          company: company._id,
          name: company.name,
          email: company.email,
          logo: company.logo,
          favicon: company.favicon,
        };
      }
      break;
    }
    case "marketer": {
      // options.expiresIn = "4h";
      secretKey = process.env.SECRET_KEY as string;
      if (!tokenData) {
        const marketer = await marketerGetByFields({ email: loginValue });
        data = {
          isMarketer: true,
          role: "marketer",
          _id: marketer._id,
          name: marketer.name,
          email: marketer.email,
          avatar: marketer.avatar,
          company: marketer.company._id,
        };
      }
      break;
    }
    case "customer": {
      secretKey = process.env.SECRET_KEY as string;
      if (!tokenData) {
        let customer = await customerGetByPhoneNumber(loginValue);
        if (!customer) {
          customer = await customerGetByEmail(loginValue);
        }
        data = {
          role: "customer",
          _id: customer._id,
          name: customer.fullName,
          avatar: customer.avatar,
        };
      }
      break;
    }
    case "collaborator": {
      secretKey = process.env.SECRET_KEY as string;
      if (!tokenData) {
        let collaborator: any = await collaboratorGetByPhoneNumber(loginValue);
        if (!collaborator) {
          collaborator = await collaboratorGetByEmail(loginValue);
        }
        data = {
          role: "collaborator",
          isCollaborator: true,
          _id: collaborator._id,
          name: collaborator.fullName,
          avatar: collaborator.avatar,
        };
      }
      break;
    }
    case "admin": {
      secretKey = process.env.SECRET_KEY as string;
      let admin: any;
      if (!tokenData) {
        admin = await getByEmail(loginValue);
      }
      data = {
        role: "admin",
        isAdmin: true,
        _id: admin._id,
        name: admin.name,
        avatar: admin.avatar,
      };
      break;
    }
  }
  accessToken = jwt.sign(data, secretKey);
  return accessToken;
};

export let verify = (token: string) => {
  const secretKey = process.env.SECRET_KEY as string;
  return jwt.verify(token, secretKey);
};
