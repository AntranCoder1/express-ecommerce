import { Request, Response } from "express";
import * as collaboratorRepo from "../repositories/collaborator.repo";
import * as collaboratorDomainRepo from "../repositories/collaboratorDomain.repo";
import * as collaboratorIncomeRepo from "../repositories/collaboratorIncome.repo";
import * as domainRepo from "../repositories/domain.repo";
import * as domainProductRepo from "../repositories/domainProduct.repo";
import * as argon2 from "argon2";
import { createAccessToken } from "../utils/authentication.util";
// Login
export const login = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await collaboratorRepo.collaboratorGetHashedPassword(
      req.body.email
    );
    if (!hashedPassword) {
      throw new Error("Thông tin đăng nhập không chính xác");
    } else {
      const correctPassword = await argon2.verify(
        hashedPassword,
        req.body.password
      );
      if (correctPassword === true) {
        const accessToken = await createAccessToken(
          "collaborator",
          req.body.email
        );
        res.status(200).json({ data: accessToken });
      } else {
        throw new Error("Thông tin đăng nhập không chính xác");
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // Check email is used
    const email = req.body.email;
    const isEmailAvailable: boolean =
      await collaboratorRepo.isCollaboratorFieldAvailable("email", email);
    if (isEmailAvailable === false) {
      throw new Error("Email này đã được sử dụng bởi một người dùng khác.");
    }
    // Check phone number is used
    const phoneNumber = req.body.phoneNumber;
    const isPhoneNumberAvailable: boolean =
      await collaboratorRepo.isCollaboratorFieldAvailable(
        "phoneNumber",
        phoneNumber
      );
    if (isPhoneNumberAvailable === false) {
      throw new Error(
        "Số điện thoại này đã được sử dụng bởi một người dùng khác."
      );
    }
    const body = {
      name: req.body.name,
      email,
      phoneNumber,
      password: await argon2.hash(req.body.password),
    };
    const result = await collaboratorRepo.collaboratorCreate(body);
    const createCollabDomain =
      await collaboratorDomainRepo.createCollaboratorDomain(result._id);
    const createCollabIncome =
      await collaboratorIncomeRepo.createCollaboratorIncome(result._id);
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  const collaborator = req.body.user._id;
  try {
    const data = await collaboratorRepo.collaboratorGetById(collaborator);
    res.status(200).json({ status: "success", data, role: "collaborator" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllDomain = async (req: Request, res: Response) => {
  try {
    const data = await collaboratorRepo.getAllDomain();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
