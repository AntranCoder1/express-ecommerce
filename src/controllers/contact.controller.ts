import { Request, Response } from "express";
import MailUlti from "../utils/email";

export const sendContact = async (req: Request, res: Response) => {
  const fullName = req.body.fullName;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const mainIndustry = req.body.mainIndustry;
  const businessType = req.body.businessType;
  const businessRegistration = req.body.businessRegistration;
  const taxCode = req.body.taxCode;
  try {
    const data = {
      fullName,
      phoneNumber,
      email,
      mainIndustry,
      businessType,
      businessRegistration,
      taxCode,
    };
    const emailResult = await MailUlti.contact(data);
    if (!emailResult.success) {
      throw emailResult.error;
    } else {
      res.status(200).send({ status: "success" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
