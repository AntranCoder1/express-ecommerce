import { Request, Response } from "express";
import * as customerRepo from "../repositories/customer.repo";
import * as argon2 from "argon2";
import { createAccessToken } from "../utils/authentication.util";
import {
  getFileDiskStorage,
  getFileLocation,
  isAllowedFile,
  removeFile,
} from "../utils/upload.util";
import * as domainRepo from "../repositories/domain.repo";
import path from "path";
import fs from "fs";
import axios from "axios";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { VietnameseStringToNonAccentedLetters } from "../utils/supporter.util";
import * as customerTokenRepo from "../repositories/customerToken.repo";
import * as customerTokenTransactionRepo from "../repositories/customerTokenTransaction.repo";
import * as customerWithdrawRepo from "../repositories/customerWithdraw.repo";
import * as customerTransactionLogRepo from "../repositories/customerTransactionLog.repo";
import * as customerIncomeRepo from "../repositories/customerIncome.repo";
import * as reviewRepo from "../repositories/review.repo";
import * as orderRepo from "../repositories/order.repo";
import * as orderDetailRepo from "../repositories/orderDetail.repo";
import getHostname from "../modules/hostname.module";
import mongoose from "mongoose";

dotenv.config();
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "3280717362199783",
//       clientSecret: "5b4a573c0842fb004a10ced3f6dade73",
//       callbackURL: "https://api.chocangay.com/auth/facebook/callback",
//       profileFields: ["email", "name"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
// let userData = {
//   email: "",
//   fullName: "",
//   password: "",
//   facebookLoginKey: "",
//   phoneNumber: "",
// };
// const { email, first_name, last_name, id } = profile._json;
// if (email !== undefined) {
//   userData = {
//     email,
//     fullName: first_name + " " + last_name,
//     password: await argon2.hash(random(12)),
//     facebookLoginKey: id,
//     phoneNumber: "",
//   };
// } else {
//   const date = new Date();
//   const newEmail =
//     VietnameseStringToNonAccentedLetters(last_name + first_name) +
//     date.getTime() +
//     ".@chocangay.com";
//   userData = {
//     email: newEmail,
//     fullName: first_name + " " + last_name,
//     password: await argon2.hash(random(12)),
//     facebookLoginKey: id,
//     phoneNumber: "",
//   };
// }
// if (userData.email !== "" && userData.facebookLoginKey !== "") {
//   const isFaceBook: boolean = await customerRepo.isCustomerFieldAvailable(
//     "facebookLoginKey",
//     userData.facebookLoginKey
//   );
//   if (isFaceBook) {
//     done(null, profile);
//   }
//   const isEmailAvailable: boolean =
//     await customerRepo.isCustomerFieldAvailable("email", userData.email);
//   if (!isEmailAvailable) {
//     throw new Error("Email này đã được sử dụng bởi một người dùng khác.");
//   }
//   const result = await customerRepo.customerCreate(userData);
//   done(null, profile);
// }
//     }
//   )
// );

export const authFacebook = async (req, res) => {
  const domain = JSON.parse(req.query.state);
  const code = req.query.code;
  const client_id = "3280717362199783";
  const client_secret = "5b4a573c0842fb004a10ced3f6dade73";
  const redirect_uri = encodeURIComponent("https://api.chocangay.com/");

  axios
    .get(
      "https://graph.facebook.com/v14.0/oauth/access_token?client_id=" +
        client_id +
        "&redirect_uri=" +
        redirect_uri +
        "&client_secret=" +
        client_secret +
        "&code=" +
        code
    )
    .then(
      (response: any) => {
        const access_token = response.data.access_token;
        axios
          .get(
            "https://graph.facebook.com/oauth/access_token?client_id=" +
              client_id +
              "&client_secret=" +
              client_secret +
              "&grant_type=client_credentials"
          )
          .then((resAccessToken) => {
            axios
              .get(
                "https://graph.facebook.com/debug_token?input_token=" +
                  access_token +
                  "&access_token=" +
                  resAccessToken.data.access_token
              )
              .then(
                (resUser) => {
                  axios
                    .get(
                      "https://graph.facebook.com/" +
                        resUser.data.data.user_id +
                        "?fields=id,name,email&access_token=" +
                        access_token
                    )
                    .then(
                      async (resUserInfo) => {
                        let userData = {
                          email: "",
                          fullName: "",
                          password: "",
                          facebookLoginKey: "",
                          phoneNumber: "",
                        };
                        const { name, email, id } = resUserInfo.data;
                        if (email !== undefined) {
                          userData = {
                            email,
                            fullName: name,
                            password: await argon2.hash(random(12)),
                            facebookLoginKey: id,
                            phoneNumber: "",
                          };
                        } else {
                          const date = new Date();
                          const newEmail =
                            VietnameseStringToNonAccentedLetters(name) +
                            date.getTime() +
                            ".@chocangay.com";
                          userData = {
                            email: newEmail,
                            fullName: name,
                            password: await argon2.hash(random(12)),
                            facebookLoginKey: id,
                            phoneNumber: "",
                          };
                        }
                        if (
                          userData.email !== "" &&
                          userData.facebookLoginKey !== ""
                        ) {
                          const isFaceBook: boolean =
                            await customerRepo.isCustomerFieldAvailable(
                              "facebookLoginKey",
                              userData.facebookLoginKey
                            );
                          if (!isFaceBook) {
                            const getUser = await customerRepo.findByFaceId(id);
                            const dataOldUser = {
                              role: "customer",
                              _id: getUser._id,
                              name: getUser.fullName,
                              avatar: getUser.avatar,
                            };
                            const secretKeyOldUser = process.env
                              .SECRET_KEY as string;
                            const accessTokenOldUser = await jwt.sign(
                              dataOldUser,
                              secretKeyOldUser
                            );
                            return res.redirect(
                              "https://" +
                                domain.domain +
                                ".chocangay.com/fb/auth/" +
                                accessTokenOldUser
                            );
                          }
                          const isEmailAvailable: boolean =
                            await customerRepo.isCustomerFieldAvailable(
                              "email",
                              userData.email
                            );
                          if (!isEmailAvailable) {
                            throw new Error(
                              "Email này đã được sử dụng bởi một người dùng khác."
                            );
                          }
                          const result: any = await customerRepo.customerCreate(
                            userData
                          );
                          const data = {
                            role: "customer",
                            _id: result._id,
                            name: result.fullName,
                            avatar: result.avatar,
                          };
                          const secretKey = process.env.SECRET_KEY as string;
                          const accessToken = await jwt.sign(data, secretKey);
                          res.redirect(
                            "https://" +
                              domain.domain +
                              ".chocangay.com/fb/auth/" +
                              accessToken
                          );
                        }
                      },
                      (err) => {
                        console.log(err);
                      }
                    );
                },
                (err) => {
                  console.log(err.response);
                }
              );
          });
      },
      (err) => {
        console.log(err);
      }
    );
};

const random = (length) => {
  let result = "";
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const getById = async (req: Request, res: Response) => {
  const customer = req.body.user._id;
  try {
    const result = await customerRepo.customerGetById(customer);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const register = async (req: Request, res: Response) => {
  try {
    // Check email is used
    const email = req.body.email;
    const isEmailAvailable: boolean =
      await customerRepo.isCustomerFieldAvailable("email", email);
    if (!isEmailAvailable) {
      throw new Error("Email này đã được sử dụng bởi một người dùng khác.");
    }
    // Check phone number is used
    const phoneNumber = req.body.phoneNumber;
    const isPhoneNumberAvailable: boolean =
      await customerRepo.isCustomerFieldAvailable("phoneNumber", phoneNumber);
    if (!isPhoneNumberAvailable) {
      throw new Error(
        "Số điện thoại này đã được sử dụng bởi một người dùng khác."
      );
    }

    const body = {
      fullName: req.body.fullName,
      email,
      phoneNumber,
      password: await argon2.hash(req.body.password),
    };
    const result = await customerRepo.customerCreate(body);
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// Login
export const login = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await customerRepo.customerGetHashedPassword(
      req.body.emailOrPhone
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
          "customer",
          req.body.emailOrPhone
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
// Update
export const update = async (req: Request, res: Response) => {
  try {
    const customer = await customerRepo.customerGetById(req.body._id);
    if (!customer) {
      throw new Error("Không tìm thấy khách hàng với id " + req.body._id);
    }
    // Check email is used
    const email = req.body.email;
    const isEmailAvailable = await customerRepo.isCustomerFieldAvailable(
      "email",
      email,
      customer._id
    );
    if (!isEmailAvailable) {
      throw new Error("Email này đã được sử dụng bởi một người dùng khác.");
    }
    // Check phone number is used
    const phoneNumber = req.body.phoneNumber;
    const isPhoneNumberAvailable = await customerRepo.isCustomerFieldAvailable(
      "phoneNumber",
      phoneNumber,
      customer._id
    );
    if (!isPhoneNumberAvailable) {
      throw new Error(
        "Số điện thoại này đã được sử dụng bởi một người dùng khác."
      );
    }

    const body = {
      fullName: req.body.fullName,
      phoneNumber,
      email,

      address: req.body.address,
    };
    const customerModified = await customerRepo.customerUpdate(
      customer._id,
      body
    );
    if (customerModified) {
      const accessToken = await createAccessToken("customer", body.phoneNumber);
      res.status(200).json({ data: accessToken });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await customerRepo.customerGetHashedPassword(
      req.body.phoneNumber
    );
    const correctPassword = await argon2.verify(
      hashedPassword,
      req.body.password
    );
    if (correctPassword === true) {
      const body = {
        password: await argon2.hash(req.body.newPassword),
      };
      const result = await customerRepo.customerUpdate(req.body._id, body);
      res.status(200).json({ data: result });
    } else {
      throw new Error("Mật khẩu người dùng không chính xác.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// Upload avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "customer-avatar", true);
    const fileStorage = getFileDiskStorage(file, "customer-avatar");

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (!isAllowedFile(file)) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const customer = await customerRepo.customerGetById(req.body._id);
      if (!customer || customer === undefined) {
        throw new Error("Không tìm thấy tài khoản người dùng " + req.body._id);
      } else {
        if (customer.avatar) {
          // Remove old image
          const oldSrc = customer.avatar.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          avatar: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };

        const result = await customerRepo.customerUpdate(
          req.body._id,
          updateData
        );
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// Avatar
export const getAvatar = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "customer-avatar");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh đại diện của người dùng.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// Delete
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await customerRepo.customerDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  const customerId = req.body.user._id;
  const name = req.body.name;
  const place = req.body.place;
  const city = req.body.city;
  const district = req.body.district;
  const commune = req.body.commune;
  const phoneNumber = req.body.phoneNumber;
  const description = req.body.description;
  const isHome = req.body.isHome;
  const isCompany = req.body.isCompany;
  try {
    const getCus = await customerRepo.getOne(customerId);
    if (isHome) {
      for (const i of getCus.address) {
        if (i.isHome) {
          i.isHome = false;
        }
      }
      const updateCustomer = await customerRepo.updateCus(
        customerId,
        getCus.address
      );
    }
    if (isCompany) {
      for (const i of getCus.address) {
        if (i.isCompany) {
          i.isCompany = false;
        }
      }
      const updateCustomer = await customerRepo.updateCus(
        customerId,
        getCus.address
      );
    }
    const data = {
      name,
      place,
      city,
      district,
      commune,
      phoneNumber,
      description,
      isHome,
      isCompany,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createAdd: any = await customerRepo.createAddress(data, customerId);

    if (createAdd) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  const customerId = req.body.user._id;
  const addressId = req.params.id;
  try {
    const getAddress: any = await customerRepo.getOne(customerId);
    for (const i of getAddress.address) {
      i.isDefault = false;
      if (i._id.valueOf() === addressId) {
        i.isDefault = true;
      }
    }
    const updateCustomer = await customerRepo.updateCus(
      customerId,
      getAddress.address
    );
    if (updateCustomer) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const customerId = req.body.user._id;
  const addressId = req.body.id;
  const name = req.body.name;
  const place = req.body.place;
  const city = req.body.city;
  const district = req.body.district;
  const commune = req.body.commune;
  const phoneNumber = req.body.phoneNumber;
  const description = req.body.description;
  const isHome = req.body.isHome;
  const isCompany = req.body.isCompany;
  try {
    const data = {
      name,
      place,
      city,
      district,
      commune,
      phoneNumber,
      description,
      isHome,
      isCompany,
      updatedAt: new Date(),
    };
    const updateAdd = await customerRepo.updateAdd(data, addressId);
    if (isHome) {
      const getCus: any = await customerRepo.getOne(customerId);
      for (const i of getCus.address) {
        i.isHome = false;
        if (i._id.valueOf() === addressId) {
          i.isHome = true;
        }
      }
      const updateCustomer = await customerRepo.updateCus(
        customerId,
        getCus.address
      );
    }
    if (isCompany) {
      const getCus: any = await customerRepo.getOne(customerId);
      for (const i of getCus.address) {
        i.isCompany = false;
        if (i._id.valueOf() === addressId) {
          i.isCompany = true;
        }
      }
      const updateCustomer = await customerRepo.updateCus(
        customerId,
        getCus.address
      );
    }
    if (updateAdd.acknowledged) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const removeAddress = async (req: Request, res: Response) => {
  const customerId = req.body.user._id;
  const addressId = req.params.id;
  try {
    const deleteAdd = await customerRepo.removeAdd(customerId, addressId);
    if (deleteAdd) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createCustomerToken = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const token = req.body.token;

    const findCustomerTokenExists =
      await customerTokenRepo.findTokenWithCustomerId(customerId);

    if (!findCustomerTokenExists) {
      // create token customer
      const dataCustomerToken = {
        customer: customerId,
        type: "deposit",
        token,
        description: "Giao dịch thành công",
      };
      const createToken = await customerTokenRepo.createToken(
        dataCustomerToken
      );

      // create transaction token history
      const dataCustomerTokenTransaction = {
        customerToken: createToken._id,
        type: "deposit",
        token,
        lastBalanceToken: token,
        description: "Bạn đã nạp " + token + " token vào tài khoản",
      };
      const createTransaction =
        await customerTokenTransactionRepo.createTransaction(
          dataCustomerTokenTransaction
        );

      // create transaction history customer
      const dataTransactionHistory = {
        customer: customerId,
        type: "deposit",
        transferMethod: "token",
        transactionCode: "",
        description: "Bạn đã nạp " + token + " token vào tài khoản",
        token,
      };
      const createTransactionHistory =
        await customerTransactionLogRepo.createTransactionLog(
          dataTransactionHistory
        );
    } else {
      // update token
      const updateToken = await customerTokenRepo.updateToken(
        findCustomerTokenExists._id,
        { token: findCustomerTokenExists.token + token }
      );

      // create transaction history
      const dataCustomerTokenTransaction = {
        customerToken: findCustomerTokenExists._id,
        type: "deposit",
        token: "+" + token,
        lastBalanceToken: findCustomerTokenExists.token + token,
        description: "Bạn đã nạp " + token + " token vào tài khoản",
      };
      const createTransaction =
        await customerTokenTransactionRepo.createTransaction(
          dataCustomerTokenTransaction
        );

      // create transaction history customer
      const dataTransactionHistory = {
        customer: customerId,
        type: "deposit",
        transferMethod: "token",
        transactionCode: "",
        description: "Bạn đã nạp " + token + " token vào tài khoản",
        token,
      };
      const createTransactionHistory =
        await customerTransactionLogRepo.createTransactionLog(
          dataTransactionHistory
        );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const findHistoryToken = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const status = req.body.status;
    const transactionMethod = req.body.transactionMethod;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const findHistory = await customerTokenRepo.findHistory(
      customerId,
      startDate,
      endDate
    );

    const findMoney = await customerIncomeRepo.getByCustomer(customerId);

    if (findHistory.length > 0) {
      let tokenDeposit = 0;
      let income = 0;

      for (const i of findHistory[0].transactionHistory) {
        if (i.type === "deposit") {
          tokenDeposit += i.token;
        } else if (i.type === "award") {
          income += i.token;
        }
      }

      res.status(200).send({
        status: "success",
        data: findHistory,
        deposit: tokenDeposit,
        surplus: findHistory[0].token,
        income,
        money: findMoney.accountBalance,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createWithdrawToken = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const token = req.body.token;
    const transferMethod = req.body.transferMethod;

    const findTokenWithCustomerId =
      await customerTokenRepo.findTokenWithCustomerId(customerId);

    if (!findTokenWithCustomerId) {
      return res.status(404).send({
        status: "failed",
        message: "bạn chưa có token, vui lòng nạp token để tiến hành giao dịch",
      });
    } else if (findTokenWithCustomerId.token < token) {
      return res.status(400).send({
        status: "failed",
        message:
          "Số dư token không đủ để thực hiện giao dịch, vui lòng nạp thêm token để tiến hành giao dịch",
      });
    } else {
      const dataWithdrawLog = {
        customer: customerId,
        type: "withdraw",
        transferMethod,
        transactionCode: "",
        description: "Yêu cầu rút",
        token,
      };
      const createCustomerWithdraw = await customerWithdrawRepo.createWithdraw(
        dataWithdrawLog
      );

      if (createCustomerWithdraw) {
        res.status(200).send({ status: "success" });
      } else {
        res.status(400).send({ status: "failed" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createWithdrawMoney = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const money = req.body.money;
    const transferMethod = req.body.transferMethod;

    const customerIncome = await customerIncomeRepo.getByCustomer(customerId);

    if (money < 50000) {
      throw new Error("Số tiền tối thiểu là 50.000đ. Vui lòng nhập lại");
    }
    if (money > customerIncome.accountBalance) {
      throw new Error("Số dư không đủ để thực hiện giao dịch");
    }
    const data = {
      customer: customerId,
      transferMethod,
      money,
      description: "Yêu cầu rút",
    };
    const createRequest = await customerWithdrawRepo.createWithdraw(data);
    const dataIncome = {
      accountBalance: customerIncome.accountBalance - money,
    };
    // const deductMoneyCollaborator =
    //   await collaboratorIncomeRepo.updateCustomerIncome(
    //     collaborator,
    //     dataIncome
    //   );

    if (createRequest) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({
        status: "failed",
        message: "Đã có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ Admin",
      });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getReviewByMaketer = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    // const maketerId = req.body.maketerId;

    const findReview = await reviewRepo.findAll({ productId });

    if (findReview) {
      res.status(200).send({ status: "success", data: findReview });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
