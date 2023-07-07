import { Request, Response } from "express";
import * as adminRepo from "../repositories/admin.repo";
import * as argon2 from "argon2";
import { createAccessToken } from "../utils/authentication.util";
// Login
export const login = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await adminRepo.adminGetHashedPassword(
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
        const accessToken = await createAccessToken("admin", req.body.email);
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
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    };
    const result = await adminRepo.createAdmin(body);
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.body.user._id;
    const admin = await adminRepo.getOne(id);
    if (admin) {
      res.status(200).send({ status: "success", data: admin });
    } else {
      res.status(400).send({
        status: "failed",
      });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
