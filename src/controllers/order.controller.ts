import { Request, Response } from "express";

import {
  orderCreate,
  orderUpdate,
  orderDelete,
  orderGetById,
  orderGetByIdCompany,
  orderGetListByCompany,
  orderGetListByMarketer,
  orderGetListByCustomer,
  getAllStatus,
} from "./../repositories/order.repo";
import {
  orderDetailCreate,
  orderDetailUpdate,
  updateOne,
} from "./../repositories/orderDetail.repo";
import * as customerRepo from "../repositories/customer.repo";
import * as orderRepo from "../repositories/order.repo";
import mongoose from "mongoose";
import getHostname from "../modules/hostname.module";
import { orderStatusGetId } from "./../repositories/orderStatus.repo";
import * as domainProductRepo from "../repositories/domainProduct.repo";
import * as orderDetailRepo from "../repositories/orderDetail.repo";
import * as domainRepo from "../repositories/domain.repo";
import * as collaboratorProductRepo from "../repositories/collaboratorProduct.repo";
import * as collaboratorOrderRepo from "../repositories/collaboratorOrder.repo";
import * as collaboratorIncomeRepo from "../repositories/collaboratorIncome.repo";
import * as orderStatusRepo from "../repositories/orderStatus.repo";
import * as marketerIncomeRepo from "../repositories/marketerIncome.repo";
import * as productVersionRepo from "../repositories/productVersion.repo";
import * as productRepo from "../repositories/product.repo";
import * as companyIncomeRepo from "../repositories/companyIncome.repo";
import * as collaboratorTransactionLogRepo from "../repositories/collaboratorTransactionLog.repo";
import * as marketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";
import * as orderCancelRepo from "../repositories/orderCancel.repo";
import * as companyTransferRepo from "../repositories/companyTransfer.repo";
import * as CompanyTokenRepo from "../repositories/companyToken.repo";
import * as companyTokenTransactionRepo from "../repositories/companyTokenTransaction.repo";
import * as markerterTokenRepo from "../repositories/markerterToken.repo";
import * as markerterTokenTransactionRepo from "../repositories/markerterTokenTransaction.repo";
import * as collaboratorTokenRepo from "../repositories/collaboratorToken.repo";
import * as collaboratorTokenTransactionRepo from "../repositories/collaboratorTokenTransaction.repo";
import * as customerTokenRepo from "../repositories/customerToken.repo";
import * as customerTokenTransactionRepo from "../repositories/customerTokenTransaction.repo";
import * as h2ExpressTokenTransactionRepo from "../repositories/h2ExpressTokenTransaction.repo";
import * as customerTransactionLogRepo from "../repositories/customerTransactionLog.repo";
import * as h2ExpressTokenRepo from "../repositories/h2ExpressToken.repo";
import * as h2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as reviewRepo from "../repositories/review.repo";
import MailUlti from "../utils/email";
import * as dotenv from "dotenv";
import * as argon2 from "argon2";
dotenv.config();
export const getByIdMarketer = async (req: Request, res: Response) => {
  try {
    const result = await orderGetById(req.params.id);
    const order_details = await orderDetailRepo.getDetailByOrderId(
      req.params.id
    );
    result[0].order_details = order_details;
    res.status(200).json({ data: result[0] });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getByIdCompany = async (req: Request, res: Response) => {
  try {
    const result = await orderGetByIdCompany(req.params.id);
    const order_details = await orderDetailRepo.getDetailByOrderId(
      req.params.id
    );
    result[0].order_details = order_details;
    res.status(200).json({ data: result[0] });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByMarketer = async (req: Request, res: Response) => {
  const marketer = req.body.user._id;
  try {
    const result = await orderGetListByMarketer(marketer);
    const income = await marketerIncomeRepo.getByMarketer(marketer);
    const deposit = await markerterTokenRepo.findDepositHistory(marketer);

    let depositToken = 0;

    for (const i of deposit[0].historyToken) {
      if (i.type === "deposit") {
        depositToken += i.token;
      }
    }

    let incomeToken = 0;

    for (const i of deposit[0].historyToken) {
      if (i.type === "award") {
        incomeToken += i.token;
      }
    }

    res.status(200).json({
      data: result,
      income,
      depositToken,
      incomeToken,
      surplus: deposit[0].token,
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.body.user.company;
    const result = await orderGetListByCompany(companyId);
    const income = await companyIncomeRepo.getByCompany(companyId);
    const deposit = await CompanyTokenRepo.transactionHistory(companyId);

    let depositToken = 0;

    for (const i of deposit[0].historyToken) {
      if (i.type === "deposit") {
        depositToken += i.token;
      }
    }

    res.status(200).send({
      status: "success",
      data: result,
      income,
      depositToken,
      surplus: deposit[0].token,
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCustomer = async (req: Request, res: Response) => {
  try {
    const status = req.body.statusId;
    const customerId = req.body.user._id;
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const result = await orderGetListByCustomer(
      customerId,
      getDomain._id,
      status
    );
    const arrId = [];
    for (const i of result) {
      arrId.push(new mongoose.Types.ObjectId(i._id));
    }
    const detailOrder = await orderDetailRepo.getAllDetailByOrderId(arrId);

    for (const i of result) {
      i.details = [];
      for (const j of detailOrder) {
        if (i._id.valueOf() === j.order.valueOf()) {
          i.details.push(j);
        }
      }
    }

    const reviewProductOrder = await reviewRepo.findAllReviewByOrderId(arrId);

    for (const i of result) {
      i.rated = false;
      for (const j of reviewProductOrder) {
        if (i._id.valueOf() === j.orderId.valueOf()) {
          i.rated = true;
        }
      }
    }

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const totalProductPrice = req.body.products.total;
    const totalPromoAmount = req.body.promos.total ? req.body.promos.total : 0;
    const shippingFee = req.body.shipping.fee;
    const bodyOrder = {
      company: req.body.company,
      domain: getDomain._id,
      marketer: req.body.marketer,
      customer: req.body.user._id,
      receiver: req.body.receiver,
      promos: null,
      shipping: req.body.shipping,
      payment: req.body.payment,
      totalPrice: totalProductPrice + shippingFee - totalPromoAmount,
      status:
        req.body.payment.type === "cash"
          ? await orderStatusGetId("pending")
          : await orderStatusGetId("verified"),
    };
    const arrItem = [];
    for (const i of req.body.products.items) {
      arrItem.push({
        product_domain: i.productDomain._id,
        product_version: i.product_version ? i.product_version._id : null,
        tokenCollaborator: i.tokenCollaborator ? i.tokenCollaborator : null,
        quantity: i.quantity,
        price: i.price,
      });
    }
    const checkQuantity = await checkQuantityProduct(arrItem);
    if (checkQuantity.status) {
      const result: any = await orderCreate(bodyOrder);
      const bodyOrderDetail = {
        items: arrItem,
        order: result._id,
      };
      const orderDetail = await orderDetailCreate(bodyOrderDetail);
      if (orderDetail) {
        const order = await orderGetById(result._id);
        const order_details: any = await orderDetailRepo.getDetailByOrderId(
          result._id
        );
        const updateInStock = updateQuantity(order_details);
        order[0].order_details = order_details;
        const emailResult = await MailUlti.order(order[0]);
        if (!emailResult.success) {
          throw emailResult.error;
        }
        let importPrice = 0;
        for (const i of order_details) {
          if (i.tokenCollaborator) {
            const getCommissionPercent =
              await domainProductRepo.getCommissionPercent(i.product_domain);
            const collaborator: any =
              await collaboratorProductRepo.getProductByToken(
                i.tokenCollaborator
              );
            const dataCollabOrder = {
              collaborator: collaborator[0].collaborator,
              domain: getDomain._id,
              order: result._id,
              orderDetail: i._id,
              collaboratorProduct: collaborator[0]._id,
              price: i.price,
              earn:
                ((i.price * getCommissionPercent.commissionPercent) / 100) *
                i.quantity,
            };
            const createCollabOrder =
              await collaboratorOrderRepo.createCollaboratorOrder(
                dataCollabOrder
              );
            const getCollabIncome =
              await collaboratorIncomeRepo.getByCollaborator(
                collaborator[0].collaborator
              );
            const dataCollabIncome = {
              expectedEarn: getCollabIncome.expectedEarn + dataCollabOrder.earn,
            };
            const updateCollaboratorIncome =
              await collaboratorIncomeRepo.updateCollabIncome(
                collaborator[0].collaborator,
                dataCollabIncome
              );
          }
          const dataOD = {
            importPrice: i.product_domain.product.importPrice,
          };
          const updateOrderDetail = await orderDetailRepo.updateOne(
            i._id,
            dataOD
          );
          importPrice += i.product_domain.product.importPrice * i.quantity;
        }
        const getMarketerIncome = await marketerIncomeRepo.getByDomain(
          getDomain._id
        );
        const dataMarketerIncome = {
          expectedEarn:
            getMarketerIncome.expectedEarn +
            bodyOrder.totalPrice -
            shippingFee -
            importPrice,
        };
        const updateMarketerIncome =
          await marketerIncomeRepo.updateMarketerIncomeByDomain(
            getDomain._id,
            dataMarketerIncome
          );
        const companyIncome = await companyIncomeRepo.getByCompany(
          order[0].company._id
        );
        const dataCompanyIncome = {
          expectedEarn: companyIncome.expectedEarn + bodyOrder.totalPrice,
        };
        const updateCompanyIncome = await companyIncomeRepo.update(
          companyIncome.company,
          dataCompanyIncome
        );

        console.log("vao day user");

        // bonus user
        const awardToken = 10;

        const findTokenCustomer =
          await customerTokenRepo.findTokenWithCustomerId(req.body.user._id);

        if (!findTokenCustomer) {
          // create token customer
          const dataLogCustomerToken = {
            customer: req.body.user._id,
            type: "award",
            token: awardToken,
            description: "Giao dịch thành công",
          };
          const createCustomerToken = await customerTokenRepo.createToken(
            dataLogCustomerToken
          );

          // create transaction token
          const dataLogCustomerTokenTransaction = {
            customerToken: createCustomerToken._id,
            type: "award",
            token: awardToken,
            lastBalanceToken: awardToken,
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
          };
          const createCustomerTokenTransaction =
            await customerTokenTransactionRepo.createTransaction(
              dataLogCustomerTokenTransaction
            );

          // create transactio history customer
          const dataTransactionHistory = {
            customer: req.body.user._id,
            type: "award",
            idType: result._id,
            transferMethod: "token",
            transactionCode: "",
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
            token: awardToken,
          };
          const createTransactionHistory =
            await customerTransactionLogRepo.createTransactionLog(
              dataTransactionHistory
            );

          // // upadate token h2Express
          // const findTokenByAdmin = await h2ExpressTokenRepo.findToken();

          // const balanceToken = findTokenByAdmin[0].token - awardToken;

          // const updateTokenH2 = await h2ExpressTokenRepo.upateToken(
          //   balanceToken
          // );

          // create transaction h2Express token
          const dataLogTokenH2Transaction = {
            type: "transfer",
            token: awardToken,
            description:
              "hệ thống đã chuyển " +
              awardToken +
              "token là khoản thưởng từ đơn hàng " +
              result._id +
              " cho customer " +
              req.body.user._id,
          };
          const createTransactionH2token =
            await h2ExpressTokenTransactionRepo.createTransaction(
              dataLogTokenH2Transaction
            );

          // create transaction history log h2Express
          const dataTransactionHistoryLog = {
            type: "transfer",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Hệ thống đã chuyển " +
              awardToken +
              " cho user " +
              req.body.user._id,
            token: awardToken,
          };
          const createTransactionLog =
            await h2ExpressTransactionRepo.createTransaction(
              dataTransactionHistoryLog
            );
        } else {
          // update token customer
          const updateTokenCustomer = await customerTokenRepo.updateToken(
            findTokenCustomer._id,
            { token: findTokenCustomer.token + awardToken }
          );

          // create transaction token
          const dataLogCustomerTransactionToken = {
            customerToken: findTokenCustomer._id,
            type: "award",
            token: awardToken,
            lastBalanceToken: findTokenCustomer.token + awardToken,
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id +
              " vì đã sử lý thành công",
          };
          const createCustomerTransactionToken =
            await customerTokenTransactionRepo.createTransaction(
              dataLogCustomerTransactionToken
            );

          // create transaction history customer
          const dataTransactionHistory = {
            customer: findTokenCustomer._id,
            type: "award",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
            token: awardToken,
          };
          const createTransactionHistory =
            await customerTransactionLogRepo.createTransactionLog(
              dataTransactionHistory
            );

          // // upadate token h2Express
          // const findTokenByAdmin = await h2ExpressTokenRepo.findToken();

          // const balanceToken = findTokenByAdmin[0].token - awardToken;

          // const updateTokenH2 = await h2ExpressTokenRepo.upateToken(
          //   balanceToken
          // );

          // create transaction h2Express token
          const dataLogTokenH2Transaction = {
            type: "transfer",
            token: awardToken,
            description:
              "hệ thống đã chuyển " +
              awardToken +
              "token là khoản thưởng từ đơn hàng " +
              result._id +
              " cho customer " +
              req.body.user._id,
          };
          const createTransactionH2token =
            await h2ExpressTokenTransactionRepo.createTransaction(
              dataLogTokenH2Transaction
            );

          // create transaction history log h2Express
          const dataTransactionHistoryLog = {
            type: "transfer",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Hệ thống đã chuyển " +
              awardToken +
              " cho user " +
              req.body.user._id,
            token: awardToken,
          };
          const createTransactionLog =
            await h2ExpressTransactionRepo.createTransaction(
              dataTransactionHistoryLog
            );
        }
        if (updateMarketerIncome && updateCompanyIncome) {
          res.status(200).json({ status: "success" });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Đã có lỗi xảy ra. Xin vui lòng thử lại sau",
          });
        }
      } else {
        res.status(400).json({
          status: "failed",
          message: "Đã có lỗi xảy ra. Xin vui lòng thử lại sau",
        });
      }
    } else {
      if (checkQuantity.version) {
        if (checkQuantity.quantity) {
          res.status(400).json({
            status: "failed",
            message:
              "Chỉ còn " +
              checkQuantity.inStock +
              " sản phẩm " +
              checkQuantity.name +
              " " +
              checkQuantity.attributes +
              " trong kho",
          });
        } else {
          res.status(400).json({
            status: "failed",
            message:
              "Sản phẩm " +
              checkQuantity.name +
              " " +
              checkQuantity.attributes +
              " đã hết hàng",
          });
        }
      } else {
        if (checkQuantity.quantity) {
          res.status(400).json({
            status: "failed",
            message:
              "Chỉ còn " +
              checkQuantity.inStock +
              " sản phẩm " +
              checkQuantity.name +
              " trong kho",
          });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Sản phẩm " + checkQuantity.name + " đã hết hàng",
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
const checkQuantityProduct = async (arrProduct) => {
  const arrProductDomainId = [];
  const arrProductVersion = [];
  for (const i of arrProduct) {
    arrProductDomainId.push(new mongoose.Types.ObjectId(i.product_domain));
    if (i.product_version) {
      arrProductVersion.push(new mongoose.Types.ObjectId(i.product_version));
    }
  }
  const getQuantityVersion = await productVersionRepo.getQuantity(
    arrProductVersion
  );
  const getQuantity = await domainProductRepo.getQuantity(arrProductDomainId);
  for (const i of getQuantity) {
    if (i.product.inStock === 0) {
      return {
        status: false,
        version: false,
        quantity: false,
        name: i.product.name,
      };
    } else {
      for (const j of arrProduct) {
        if (j.product_version === i.product._id.valueOf()) {
          if (j.quantity > i.product.inStock) {
            return {
              status: false,
              version: false,
              quantity: true,
              inStock: i.product.inStock,
              name: i.product.name,
              attributes: i.attributes,
            };
          }
        }
      }
    }
  }
  for (const i of getQuantityVersion) {
    if (i.inStock === 0) {
      return {
        status: false,
        version: true,
        quantity: false,
        name: i.product.name,
        attributes: i.attributes,
      };
    } else {
      for (const j of arrProduct) {
        if (j.product_version === i._id.valueOf()) {
          if (j.quantity > i.inStock) {
            return {
              status: false,
              version: true,
              quantity: true,
              inStock: i.inStock,
              name: i.product.name,
              attributes: i.attributes,
            };
          }
        }
      }
    }
  }
  return { status: true };
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
export const createnl = async (req: Request, res: Response) => {
  try {
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const totalProductPrice = req.body.products.total;
    const totalPromoAmount = req.body.promos.total ? req.body.promos.total : 0;
    const shippingFee = req.body.shipping.fee;
    const receiver = req.body.receiver;
    const bodyOrder = {
      company: req.body.company,
      domain: getDomain._id,
      marketer: req.body.marketer,
      customer: null,
      receiver,
      promos: null,
      shipping: req.body.shipping,
      payment: req.body.payment,
      totalPrice: totalProductPrice + shippingFee - totalPromoAmount,
      status:
        req.body.payment.type === "cash"
          ? await orderStatusGetId("pending")
          : await orderStatusGetId("verified"),
    };
    if (receiver) {
      const isEmailAvailable: boolean =
        await customerRepo.isCustomerFieldAvailable("email", receiver.email);
      if (!isEmailAvailable) {
        const customer = await customerRepo.customerGetByEmail(receiver.email);
        bodyOrder.customer = customer._id;
      } else {
        const newCustomerData = {
          email: receiver.email,
          fullName: receiver.fullName,
          password: await argon2.hash(random(12)),
          phoneNumber: receiver.phoneNumber,
        };
        const newCustomer = await customerRepo.customerCreate(newCustomerData);
        bodyOrder.customer = newCustomer._id;
      }
    }
    const arrItem = [];

    for (const i of req.body.products.items) {
      arrItem.push({
        product_domain: i.productDomain._id,
        product_version: i.product_version ? i.product_version._id : null,
        tokenCollaborator: i.tokenCollaborator ? i.tokenCollaborator : null,
        quantity: i.quantity,
        price: i.price,
      });
    }

    const checkQuantity = await checkQuantityProduct(arrItem);
    if (checkQuantity.status) {
      const result: any = await orderCreate(bodyOrder);
      const bodyOrderDetail = {
        items: arrItem,
        order: result._id,
      };
      const orderDetail = await orderDetailCreate(bodyOrderDetail);
      if (orderDetail) {
        const order = await orderGetById(result._id);
        const order_details: any = await orderDetailRepo.getDetailByOrderId(
          result._id
        );
        const updateInStock = updateQuantity(order_details);
        order[0].order_details = order_details;
        const emailResult = await MailUlti.order(order[0]);
        if (!emailResult.success) {
          throw emailResult.error;
        }
        let importPrice = 0;
        for (const i of order_details) {
          if (i.tokenCollaborator) {
            const getCommissionPercent =
              await domainProductRepo.getCommissionPercent(i.product_domain);
            const collaborator: any =
              await collaboratorProductRepo.getProductByToken(
                i.tokenCollaborator
              );
            const dataCollabOrder = {
              collaborator: collaborator[0].collaborator,
              domain: getDomain._id,
              order: result._id,
              orderDetail: i._id,
              collaboratorProduct: collaborator[0]._id,
              price: i.price,
              earn:
                ((i.price * getCommissionPercent.commissionPercent) / 100) *
                i.quantity,
            };
            const createCollabOrder =
              await collaboratorOrderRepo.createCollaboratorOrder(
                dataCollabOrder
              );
            const getCollabIncome =
              await collaboratorIncomeRepo.getByCollaborator(
                collaborator[0].collaborator
              );
            const dataIncome = {
              expectedEarn:
                getCollabIncome.expectedEarn +
                dataCollabOrder.earn * i.quantity,
            };
            const updateCollaboratorIncome =
              await collaboratorIncomeRepo.updateCollabIncome(
                collaborator[0].collaborator,
                dataIncome
              );
          }
          const dataOD = {
            importPrice: i.product_domain.product.importPrice,
          };
          const updateOrderDetail = await orderDetailRepo.updateOne(
            i._id,
            dataOD
          );
          importPrice += i.product_domain.product.importPrice * i.quantity;
        }

        const getMarketerIncome = await marketerIncomeRepo.getByDomain(
          getDomain._id
        );
        const dataMarketerIncome = {
          expectedEarn:
            getMarketerIncome.expectedEarn +
            bodyOrder.totalPrice -
            shippingFee -
            importPrice,
        };
        const updateMarketerIncome =
          await marketerIncomeRepo.updateMarketerIncomeByDomain(
            getDomain._id,
            dataMarketerIncome
          );
        const companyIncome = await companyIncomeRepo.getByCompany(
          order[0].company._id
        );
        const dataCompanyIncome = {
          expectedEarn: companyIncome.expectedEarn + bodyOrder.totalPrice,
        };
        const updateCompanyIncome = await companyIncomeRepo.update(
          companyIncome.company,
          dataCompanyIncome
        );

        // bonus user
        const awardToken = 10;

        const findTokenCustomer =
          await customerTokenRepo.findTokenWithCustomerId(bodyOrder.customer);

        if (!findTokenCustomer) {
          // create customer token
          const dataLogCustomer = {
            customer: bodyOrder.customer,
            type: "award",
            token: awardToken,
            description: "Giao dịch thành công",
          };
          const createCustomerToken = await customerTokenRepo.createToken(
            dataLogCustomer
          );

          // create transaction token
          const dataLogCustomerTokenTransaction = {
            customerToken: createCustomerToken._id,
            type: "award",
            token: awardToken,
            lastBalanceToken: awardToken,
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
          };
          const createCustomerTokenTransaction =
            await customerTokenTransactionRepo.createTransaction(
              dataLogCustomerTokenTransaction
            );

          // create transaction history customer
          const dataTransactionHistory = {
            customer: bodyOrder.customer,
            type: "award",
            idType: result._id,
            transferMethod: "token",
            transactionCode: "",
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
            token: awardToken,
          };
          const createTransactionHistory =
            await customerTransactionLogRepo.createTransactionLog(
              dataTransactionHistory
            );

          // upadate token h2Express
          const findTokenByAdmin = await h2ExpressTokenRepo.findToken();

          const balanceToken = findTokenByAdmin[0].token - awardToken;

          const updateTokenH2 = await h2ExpressTokenRepo.upateToken(
            balanceToken
          );

          // create transaction h2Express token
          const dataLogTokenH2Transaction = {
            type: "transfer",
            token: awardToken,
            description:
              "hệ thống đã chuyển " +
              awardToken +
              "token là khoản thưởng từ đơn hàng " +
              result._id +
              " cho customer " +
              bodyOrder.customer,
          };
          const createTransactionH2token =
            await h2ExpressTokenTransactionRepo.createTransaction(
              dataLogTokenH2Transaction
            );

          // create transaction history log h2Express
          const dataTransactionHistoryLog = {
            type: "transfer",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Hệ thống đã chuyển " +
              awardToken +
              " cho customer " +
              bodyOrder.customer,
            token: awardToken,
          };
          const createTransactionLog =
            await h2ExpressTransactionRepo.createTransaction(
              dataTransactionHistoryLog
            );
        } else {
          // update token customer
          const updateTokenCustomer = await customerTokenRepo.updateToken(
            findTokenCustomer._id,
            { token: findTokenCustomer.token + awardToken }
          );

          // create transaction token
          const dataLogCustomerTransactionToken = {
            customerToken: findTokenCustomer._id,
            type: "award",
            token: awardToken,
            lastBalanceToken: findTokenCustomer.token + awardToken,
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id +
              " vì đã sử lý thành công",
          };
          const createCustomerTransactionToken =
            await customerTokenTransactionRepo.createTransaction(
              dataLogCustomerTransactionToken
            );

          // create transaction history customer
          const dataTransactionHistory = {
            customer: bodyOrder.customer,
            type: "award",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Bạn đã nhận được " +
              awardToken +
              " token từ đơn hàng " +
              result._id,
            token: awardToken,
          };
          const createTransactionHistory =
            await customerTransactionLogRepo.createTransactionLog(
              dataTransactionHistory
            );

          // upadate token h2Express
          const findTokenByAdmin = await h2ExpressTokenRepo.findToken();

          const balanceToken = findTokenByAdmin[0].token - awardToken;

          const updateTokenH2 = await h2ExpressTokenRepo.upateToken(
            balanceToken
          );

          // create transaction h2Express token
          const dataLogTokenH2Transaction = {
            type: "transfer",
            token: awardToken,
            description:
              "hệ thống đã chuyển " +
              awardToken +
              "token là khoản thưởng từ đơn hàng " +
              result._id +
              " cho customer " +
              bodyOrder.customer,
          };
          const createTransactionH2token =
            await h2ExpressTokenTransactionRepo.createTransaction(
              dataLogTokenH2Transaction
            );

          // create transaction history log h2Express
          const dataTransactionHistoryLog = {
            type: "transfer",
            transferMethod: "token",
            transactionCode: "",
            description:
              "Hệ thống đã chuyển " +
              awardToken +
              " cho customer " +
              bodyOrder.customer,
            token: awardToken,
          };
          const createTransactionLog =
            await h2ExpressTransactionRepo.createTransaction(
              dataTransactionHistoryLog
            );
        }
        if (updateMarketerIncome && updateCompanyIncome) {
          res.status(200).json({ status: "success" });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Đã có lỗi xảy ra. Xin vui lòng thử lại sau",
          });
        }
      } else {
        res.status(400).json({
          status: "failed",
          message: "Đã có lỗi xảy ra. Xin vui lòng thử lại sau",
        });
      }
    } else {
      if (checkQuantity.version) {
        res.status(400).json({
          status: "failed",
          message:
            "Sản phẩm " +
            checkQuantity.name +
            " " +
            checkQuantity.attributes +
            " đã hết hàng",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Sản phẩm " + checkQuantity.name + " đã hết hàng",
        });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

const updateQuantity = async (order_details) => {
  for (const i of order_details) {
    const productId = i.product_domain.product._id;
    const inStockProduct = {
      inStock: i.product_domain.product.inStock - i.quantity,
    };
    const productVersionId = i.product_version._id;
    const inStockProductVersion = {
      inStock: i.product_version.inStock - i.quantity,
    };
    const updateStockProduct = await productRepo.updateInStock(
      productId,
      inStockProduct
    );
    const updateStockProductVersion = await productVersionRepo.updateInStock(
      productVersionId,
      inStockProductVersion
    );
  }
};

const formatCurrency = (money) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const role = req.body.user.role;
    const idPerson = req.body.user._id;
    const reasonCancel = req.body.reason;
    const orderId = req.body._id;
    const status = req.body.status;
    const body = {
      status,
    };
    const result = await orderUpdate(orderId, body);
    const getStatuss = await orderStatusRepo.getStatusById(req.body.status);
    const order = await orderRepo.orderGetById(orderId);
    const order_details = await orderDetailRepo.getDetailByOrderId(orderId);
    const getMarketerIncome = await marketerIncomeRepo.getByDomain(
      order[0].domain._id
    );

    console.log("getStatuss", getStatuss);

    if (getStatuss.keyword === "delivered") {
      console.log("vao day");

      const collabOrder = await collaboratorOrderRepo.getByOrder(orderId);
      const payment = {
        isPayment: 1,
      };

      if (collabOrder[0]) {
        const collabIncome = await collaboratorIncomeRepo.getByCollaborator(
          collabOrder[0].collaborator
        );
        const earnMoney = collabIncome.totalEarn + collabOrder[0].earn;
        const accountBalance =
          collabIncome.accountBalance + collabOrder[0].earn;
        const dataCollabIncome = {
          totalEarn: earnMoney,
          accountBalance,
          expectedEarn: collabIncome.expectedEarn - collabOrder[0].earn,
        };
        const updateCollaboratorIncome =
          await collaboratorIncomeRepo.updateCollabIncome(
            collabOrder[0].collaborator,
            dataCollabIncome
          );
        let importPrice = 0;
        for (const i of order_details) {
          importPrice += i.importPrice * i.quantity;
        }
        const dataMarketerIncome = {
          totalEarn:
            getMarketerIncome.totalEarn +
            order[0].totalPrice -
            collabOrder[0].earn -
            order[0].shipping.type.fee -
            importPrice,
          commission: getMarketerIncome.commission + collabOrder[0].earn,
          expectedEarn:
            getMarketerIncome.expectedEarn -
            (order[0].totalPrice - order[0].shipping.type.fee - importPrice),
          accountBalance:
            getMarketerIncome.accountBalance +
            (order[0].totalPrice -
              collabOrder[0].earn -
              order[0].shipping.type.fee -
              importPrice),
        };
        const updateMarketerIncome =
          await marketerIncomeRepo.updateMarketerIncomeByDomain(
            order[0].domain._id,
            dataMarketerIncome
          );
        const companyIncome = await companyIncomeRepo.getByCompany(
          order[0].company._id
        );
        const dataCompanyIncome = {
          totalEarn: companyIncome.totalEarn + order[0].totalPrice,
          expectedEarn: companyIncome.expectedEarn - order[0].totalPrice,
        };
        const updateCompanyIncome = await companyIncomeRepo.update(
          companyIncome.company,
          dataCompanyIncome
        );
        const moneyMarketer =
          order[0].totalPrice -
          collabOrder[0].earn -
          order[0].shipping.type.fee -
          importPrice;
        const isTransactionLog = await transactionLogCollab(
          collabOrder[0],
          orderId,
          order,
          moneyMarketer
        );
        const updateOrder = await orderUpdate(orderId, payment);
        if (
          updateCollaboratorIncome &&
          updateMarketerIncome &&
          updateCompanyIncome &&
          isTransactionLog &&
          updateOrder
        ) {
          res.status(200).json({ status: "success", result });
        } else {
          res.status(400).json({ status: "failed" });
        }
      } else {
        let importPrice = 0;
        for (const i of order_details) {
          importPrice += i.importPrice * i.quantity;
        }
        const dataMarketerIncome = {
          totalEarn:
            getMarketerIncome.totalEarn +
            order[0].totalPrice -
            order[0].shipping.type.fee -
            importPrice,
          expectedEarn:
            getMarketerIncome.expectedEarn -
            (order[0].totalPrice - order[0].shipping.type.fee - importPrice),
          accountBalance:
            getMarketerIncome.accountBalance +
            order[0].totalPrice -
            order[0].shipping.type.fee -
            importPrice,
        };
        const updateMarketerIncome =
          await marketerIncomeRepo.updateMarketerIncomeByDomain(
            order[0].domain._id,
            dataMarketerIncome
          );
        const companyIncome = await companyIncomeRepo.getByCompany(
          order[0].company._id
        );
        const dataCompanyIncome = {
          totalEarn: companyIncome.totalEarn + order[0].totalPrice,
          expectedEarn: companyIncome.expectedEarn - order[0].totalPrice,
        };
        const updateCompanyIncome = await companyIncomeRepo.update(
          companyIncome.company,
          dataCompanyIncome
        );
        const moneyMarketer =
          getMarketerIncome.totalEarn +
          order[0].totalPrice -
          order[0].shipping.type.fee -
          importPrice;
        const isTransactionLog = await transactionLog(
          req.body._id,
          order,
          moneyMarketer
        );
        const updateOrder = await orderUpdate(req.body._id, payment);
        if (
          updateMarketerIncome &&
          updateCompanyIncome &&
          isTransactionLog &&
          updateOrder
        ) {
          res.status(200).json({ status: "success", result });
        } else {
          res.status(400).json({ status: "failed" });
        }
      }
    } else if (getStatuss.keyword === "canceled") {
      const collabOrder = await collaboratorOrderRepo.getByOrder(req.body._id);
      if (collabOrder[0]) {
        const collabIncome = await collaboratorIncomeRepo.getByCollaborator(
          collabOrder[0].collaborator
        );
        const dataIncome = {
          expectedEarn: collabIncome.expectedEarn - collabOrder[0].earn,
        };
        const updateCollaboratorIncome =
          await collaboratorIncomeRepo.updateCollabIncome(
            collabOrder[0].collaborator,
            dataIncome
          );
      }
      let importPrice = 0;
      for (const i of order_details) {
        importPrice += i.importPrice * i.quantity;
      }
      const dataMarketerIncome = {
        expectedEarn:
          getMarketerIncome.expectedEarn -
          (order[0].totalPrice - order[0].shipping.type.fee - importPrice),
      };
      const updateMarketerIncome =
        await marketerIncomeRepo.updateMarketerIncomeByDomain(
          order[0].domain._id,
          dataMarketerIncome
        );
      const companyIncome = await companyIncomeRepo.getByCompany(
        order[0].company._id
      );
      let dataCompanyIncome;
      if (order[0].isCompanyBuy === 0) {
        dataCompanyIncome = {
          expectedEarn: companyIncome.expectedEarn - order[0].totalPrice,
        };
      } else {
        const orderFee =
          order[0].totalPrice - order[0].shipping.type.fee - importPrice;
        dataCompanyIncome = {
          expectedEarn: companyIncome.expectedEarn - order[0].totalPrice,
          accountBalance: companyIncome.accountBalance + orderFee,
          refunds: companyIncome.refunds + orderFee,
        };
        const transferData = {
          company: companyIncome.company,
          type: "refundOrderFee",
          idType: orderId,
          transferMethod: "system",
          lastBalance: companyIncome.accountBalance,
          money: orderFee,
          status: 1,
          description: "Giao dịch thành công",
        };
        const createTransfer = await companyTransferRepo.createCompanyTransfer(
          transferData
        );
        const transactionData = {
          company: companyIncome.company,
          type: "refundOrderFee",
          idType: createTransfer._id,
          lastBalance: companyIncome.accountBalance,
          money: orderFee,
          transferMethod: "system",
          description:
            "Bạn đã nhận lại phí đơn hàng " +
            formatCurrency(orderFee) +
            " của đơn hàng " +
            orderId +
            " đã bị hủy",
          transactionCode: "",
        };
        const createTransaction =
          await companyTransactionLogRepo.createCompanyTransactionLog(
            transactionData
          );
      }

      const updateCompanyIncome = await companyIncomeRepo.update(
        companyIncome.company,
        dataCompanyIncome
      );
      const dataCancel = {
        order: orderId,
        reasonCancel,
        roleCancel: role,
        idPersonCancel: idPerson,
      };
      const createOrderCancel = await orderCancelRepo.createOrderCancel(
        dataCancel
      );
      if (updateMarketerIncome && updateCompanyIncome && createOrderCancel) {
        res.status(200).json({ status: "success", result });
      } else {
        res.status(400).json({ status: "failed" });
      }
    } else {
      res.status(200).json({ status: "success", result });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

const transactionLogCollab = async (collabOrder, id, order, money) => {
  const dataLogCollab = {
    collaborator: collabOrder.collaborator,
    type: "order",
    idType: id,
    money: "+" + collabOrder.earn,
    description:
      "Bạn đã nhận được " +
      collabOrder.orderDetail.domain_product.commissionPercent +
      "% hoa hồng của đơn hàng " +
      collabOrder.order +
      " từ cửa hàng" +
      collabOrder.domain.name,
    transferMethod: "system",
    transactionCode: "",
  };
  const createCollabTransactionLog =
    await collaboratorTransactionLogRepo.createCollaboratorTransactionLog(
      dataLogCollab
    );
  const dataLogMarketer = {
    marketer: order[0].marketer._id,
    type: "order",
    idType: id,
    money: "+" + money,
    description:
      "Bạn đã nhận được " +
      formatCurrency(money) +
      "từ đơn hàng " +
      collabOrder.order,
    transferMethod: "system",
    transactionCode: "",
  };
  const createMarketerTransactionLog =
    await marketerTransactionLogRepo.createMarketerTransactionLog(
      dataLogMarketer
    );
  const dataLogCompany = {
    company: order[0].company._id,
    type: "order",
    idType: id,
    money: "+" + order[0].totalPrice,
    description:
      "Bạn đã nhận được " +
      formatCurrency(order[0].totalPrice) +
      "từ đơn hàng " +
      collabOrder.order,
    transferMethod: "system",
    transactionCode: "",
  };
  const createCompanyTransactionLog =
    await companyTransactionLogRepo.createCompanyTransactionLog(dataLogCompany);

  // award token
  const tokenAward = 100;
  const tokenCollabAwardPercent = 10;

  const companyToken = await CompanyTokenRepo.getTokenWithCompany(
    order[0].company._id
  );

  const findMarkerterToken = await markerterTokenRepo.findByMarkerterId(
    order[0].marketer._id
  );

  if (!findMarkerterToken) {
    // create marketer token
    const dataLogTokenMarketer = {
      company: order[0].company._id,
      markerter: order[0].marketer._id,
      type: "award",
      token: tokenAward,
      description: "Giao dịch thành công",
    };
    const createMakerterToken = await markerterTokenRepo.createToken(
      dataLogTokenMarketer
    );

    // create marketer transaction token
    const dataLogTokenTransactionMarkerter = {
      company: order[0].company._id,
      markerterToken: createMakerterToken._id,
      type: "award",
      token: "+" + tokenAward,
      lastBalanceToken: tokenAward,
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        collabOrder.order,
    };
    const createMarkerterTokenTransaction =
      await markerterTokenTransactionRepo.createTransaction(
        dataLogTokenTransactionMarkerter
      );

    // create transaction log marketer
    const dataMarkerterTransation = {
      marketer: order[0].marketer._id,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        collabOrder.order,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );

    // update company token
    const companyTokenCreate = await CompanyTokenRepo.getTokenWithCompany(
      order[0].company._id
    );
    const updateCompanTokenCreate = await CompanyTokenRepo.updateCompanyToken(
      order[0].company._id,
      {
        token: companyTokenCreate.token - tokenAward,
      }
    );

    // create transaction token company
    const dataRecordTransactionCompany = {
      company: order[0].company._id,
      companyToken: companyTokenCreate._id,
      type: "transferAward",
      token: "-" + tokenAward,
      lastBalanceToken: companyTokenCreate.token - tokenAward,
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        collabOrder.order,
    };
    const transactionHistoryCompany =
      await companyTokenTransactionRepo.createTransaction(
        dataRecordTransactionCompany
      );

    // create transaction company
    const dataTransactionCompany = {
      company: order[0].company._id,
      type: "transfer",
      lastBalance: companyTokenCreate.token - tokenAward,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        collabOrder.order,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionCompany =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        dataTransactionCompany
      );
  } else {
    // update token maketer
    const lastToken = findMarkerterToken.token + tokenAward;

    const updateMarkerterToken = await markerterTokenRepo.updateToken(
      order[0].marketer._id,
      order[0].company._id,
      {
        token: lastToken,
        description: "Giao dịch thành công",
      }
    );

    // create marketer transaction token
    const markerterTokenTransactionData = {
      company: order[0].company._id,
      markerterToken: findMarkerterToken._id,
      type: "award",
      token: "+" + tokenAward,
      lastBalanceToken: lastToken,
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        collabOrder.order,
    };
    const createMarkerterTokenTransactionUpdate =
      await markerterTokenTransactionRepo.createTransaction(
        markerterTokenTransactionData
      );

    // create transaction log marketer
    const dataMarkerterTransation = {
      markerter: order[0].marketer._id,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        collabOrder.order,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );

    // update company token
    const companyTokenUpdate = await CompanyTokenRepo.getTokenWithCompany(
      order[0].company._id
    );

    const lastCompanyToken = companyTokenUpdate.token - tokenAward;

    const updateCompanTokenUpdate = await CompanyTokenRepo.updateCompanyToken(
      order[0].company._id,
      {
        token: lastCompanyToken,
      }
    );

    // create transaction token company
    const dataRecordTransactionTokenCompany = {
      company: order[0].company._id,
      companyToken: companyTokenUpdate._id,
      type: "transferAward",
      token: "-" + tokenAward,
      lastBalanceToken: lastCompanyToken,
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        collabOrder.order,
    };
    const transactionHistoryCompanyRecord =
      await companyTokenTransactionRepo.createTransaction(
        dataRecordTransactionTokenCompany
      );

    // create transaction company
    const dataTransactionCompany = {
      company: order[0].company._id,
      type: "transfer",
      lastBalance: lastCompanyToken,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        id,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionCompany =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        dataTransactionCompany
      );
  }

  // award percent collab
  const findCollaboratorToken =
    await collaboratorTokenRepo.findTokenWithCollabId(collabOrder.collaborator);

  if (!findCollaboratorToken) {
    // create collab token
    const dataLogTokenCollab = {
      collaborator: collabOrder.collaborator,
      token: tokenCollabAwardPercent,
      description: "Giao dịch thành công",
    };
    const createCollaboratorToken =
      await collaboratorTokenRepo.createCollaboratorToken(dataLogTokenCollab);

    // create collab transaction token
    const dataLogTokenTransactionCollab = {
      collaboratorToken: createCollaboratorToken._id,
      type: "award",
      token: "+" + tokenCollabAwardPercent,
      lastBalanceToken: tokenCollabAwardPercent,
      description:
        "Bạn đã nhận được " +
        tokenCollabAwardPercent +
        " % token hoa hồng của đơn hàng " +
        collabOrder.order +
        " từ markerter " +
        order[0].marketer.name,
    };
    const createTransactionTokenCollab =
      await collaboratorTokenTransactionRepo.createTransaction(
        dataLogTokenTransactionCollab
      );

    // collab transaction log
    const dataCollabTransaction = {
      collaborator: collabOrder.collaborator,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "Bạn đã nhận được " +
        tokenCollabAwardPercent +
        " % token hoa hồng của đơn hàng " +
        collabOrder.order +
        " từ markerter " +
        order[0].marketer.name,
      transactionCode: "",
      token: tokenCollabAwardPercent,
    };
    const createTransactionCollab =
      await collaboratorTransactionLogRepo.createCollaboratorTransactionLog(
        dataCollabTransaction
      );

    // update token markerter
    const findTokemarkerter = await markerterTokenRepo.findByMarkerterId(
      order[0].marketer._id
    );
    const lastTokenMarketer = findTokemarkerter.token - tokenCollabAwardPercent;

    const updateTokenMarkerter = await markerterTokenRepo.updateToken(
      order[0].marketer._id,
      order[0].company._id,
      {
        token: lastTokenMarketer,
      }
    );

    // create maketer transaction token
    const findMarkerterTokens = await markerterTokenRepo.findByMarkerterId(
      order[0].marketer._id
    );
    const collabMarkerterTokenTransactionData = {
      company: order[0].company._id,
      markerterToken: findMarkerterTokens._id,
      type: "transferAward",
      token: "-" + tokenAward,
      lastBalanceToken: lastTokenMarketer,
      description:
        "bạn đã chuyển " +
        tokenCollabAwardPercent +
        " token cho " +
        collabOrder.collaborator +
        " từ hoá đơn " +
        collabOrder.order,
    };
    const createCollabMarkerterTokenTransactionUpdate =
      await markerterTokenTransactionRepo.createTransaction(
        collabMarkerterTokenTransactionData
      );

    // create transaction log marketer
    const dataMarkerterTransation = {
      marketer: order[0].marketer._id,
      type: "transfer",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenCollabAwardPercent +
        " token cho " +
        collabOrder.collaborator +
        " từ hoá đơn " +
        collabOrder.order,
      transactionCode: "",
      token: tokenCollabAwardPercent,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );
  } else {
    // update collab token
    const lastTokenCollab =
      findCollaboratorToken.token + tokenCollabAwardPercent;

    const updateTokenCollab = await collaboratorTokenRepo.updateToken(
      collabOrder.collaborator,
      {
        token: lastTokenCollab,
      }
    );

    // create collab transaction token
    const dataLogTransactionTokenCollab = {
      collaboratorToken: findCollaboratorToken._id,
      type: "award",
      token: "+" + tokenCollabAwardPercent,
      lastBalanceToken: lastTokenCollab,
      description:
        "Bạn đã nhận được " +
        tokenCollabAwardPercent +
        " % token hoa hồng của đơn hàng " +
        collabOrder.order +
        " từ markerter " +
        order[0].marketer.name,
    };
    const createTokenTransactionCollab =
      await collaboratorTokenTransactionRepo.createTransaction(
        dataLogTransactionTokenCollab
      );

    // collab transaction log
    const dataCollabTransaction = {
      collaborator: collabOrder.collaborator,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "Bạn đã nhận được " +
        tokenCollabAwardPercent +
        " % token hoa hồng của đơn hàng " +
        collabOrder.order +
        " từ markerter " +
        order[0].marketer.name,
      transactionCode: "",
      token: tokenCollabAwardPercent,
    };
    const createTransactionCollab =
      await collaboratorTransactionLogRepo.createCollaboratorTransactionLog(
        dataCollabTransaction
      );

    // update token markerter
    const findTokemarkerter = await markerterTokenRepo.findByMarkerterId(
      order[0].marketer._id
    );

    const lastTokenMarketer = findTokemarkerter.token - tokenCollabAwardPercent;

    const updateTokenMarkerter = await markerterTokenRepo.updateToken(
      order[0].marketer._id,
      order[0].company._id,
      {
        token: lastTokenMarketer,
      }
    );

    // create marketer transaction token
    const findMarkerterTokenUpdate = await markerterTokenRepo.findByMarkerterId(
      order[0].marketer._id
    );
    const markerterTokenTransactionCollabData = {
      company: order[0].company._id,
      markerterToken: findMarkerterTokenUpdate._id,
      type: "transferAward",
      token: "-" + tokenAward,
      lastBalanceToken: lastTokenMarketer,
      description:
        "bạn đã chuyển " +
        tokenCollabAwardPercent +
        " token cho " +
        collabOrder.collaborator +
        " từ hoa hồng của hoá đơn " +
        collabOrder.order,
    };
    const createCollabMarkerterTokenTransactionUpdateCollab =
      await markerterTokenTransactionRepo.createTransaction(
        markerterTokenTransactionCollabData
      );

    // create transaction log marketer
    const dataMarkerterTransation = {
      marketer: order[0].marketer._id,
      type: "transfer",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenCollabAwardPercent +
        " token cho " +
        collabOrder.collaborator +
        " từ hoá đơn " +
        collabOrder.order,
      transactionCode: "",
      token: tokenCollabAwardPercent,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );
  }
  if (
    createCollabTransactionLog &&
    createMarketerTransactionLog &&
    createCompanyTransactionLog
  ) {
    return true;
  } else {
    return false;
  }
};

const transactionLog = async (id, order, money) => {
  const dataLogMarketer = {
    marketer: order[0].marketer._id,
    type: "order",
    idType: id,
    money: "+" + money,
    description:
      "Bạn đã nhận được " + formatCurrency(money) + "từ đơn hàng " + id,
    transferMethod: "system",
    transactionCode: "",
  };
  const createMarketerTransactionLog =
    await marketerTransactionLogRepo.createMarketerTransactionLog(
      dataLogMarketer
    );
  const dataLogCompany = {
    company: order[0].company._id,
    type: "order",
    idType: id,
    money: "+" + order[0].totalPrice,
    description:
      "Bạn đã nhận được " +
      formatCurrency(order[0].totalPrice) +
      "từ đơn hàng " +
      id,
    transferMethod: "system",
    transactionCode: "",
  };
  const createCompanyTransactionLog =
    await companyTransactionLogRepo.createCompanyTransactionLog(dataLogCompany);

  // award marketer token

  const tokenAward = 100;

  const companyToken = await CompanyTokenRepo.getTokenWithCompany(
    order[0].company._id
  );

  const findMarkerterToken = await markerterTokenRepo.findByMarkerterId(
    order[0].marketer._id
  );

  if (!findMarkerterToken) {
    // create marketer token
    const dataLogTokenMarketer = {
      company: order[0].company._id,
      markerter: order[0].marketer._id,
      type: "award",
      token: tokenAward,
      description: "Giao dịch thành công",
    };
    const createMakerterToken = await markerterTokenRepo.createToken(
      dataLogTokenMarketer
    );

    // create marketer transaction token
    const dataLogTokenTransactionMarkerter = {
      company: order[0].company._id,
      markerterToken: createMakerterToken._id,
      type: "award",
      token: "+" + tokenAward,
      lastBalanceToken: tokenAward,
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        id,
    };
    const createMarkerterTokenTransaction =
      await markerterTokenTransactionRepo.createTransaction(
        dataLogTokenTransactionMarkerter
      );

    // create transaction marketer
    const dataMarkerterTransation = {
      marketer: order[0].marketer._id,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        id,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );

    // update company token
    const companyTokenCreate = await CompanyTokenRepo.getTokenWithCompany(
      order[0].company._id
    );
    const updateCompanTokenCreate = await CompanyTokenRepo.updateCompanyToken(
      order[0].company._id,
      {
        token: companyTokenCreate.token - tokenAward,
      }
    );

    // create transaction token company
    const dataTransactionTokenCompany = {
      company: order[0].company._id,
      companyToken: companyTokenCreate._id,
      type: "transfer",
      token: "-" + tokenAward,
      lastBalanceToken: companyTokenCreate.token - tokenAward,
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        id,
    };
    const transactionHistoryCompany =
      await companyTokenTransactionRepo.createTransaction(
        dataTransactionTokenCompany
      );

    // create transaction company
    const dataTransactionCompany = {
      company: order[0].company._id,
      type: "transfer",
      lastBalance: companyTokenCreate.token - tokenAward,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        id,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionCompany =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        dataTransactionCompany
      );
  } else {
    // update token marketer
    const updateMarkerterToken = await markerterTokenRepo.updateToken(
      order[0].marketer._id,
      order[0].company._id,
      {
        token: findMarkerterToken.token + tokenAward,
        description: "Giao dịch thành công",
      }
    );

    // create marketer transaction token
    const dataLogTokenTransactionMarkerter = {
      company: order[0].company._id,
      markerterToken: findMarkerterToken._id,
      type: "award",
      token: "+" + tokenAward,
      lastBalanceToken: tokenAward,
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        id,
    };
    const createMarkerterTokenTransaction =
      await markerterTokenTransactionRepo.createTransaction(
        dataLogTokenTransactionMarkerter
      );

    // create transaction marketer
    const dataMarkerterTransation = {
      marketer: order[0].marketer._id,
      type: "award",
      idType: id,
      transferMethod: "token",
      description:
        "bạn đã được chuyển " +
        tokenAward +
        " token từ " +
        order[0].company.name +
        " cho đơn hàng " +
        id,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionWithToken =
      marketerTransactionLogRepo.createMarketerTransactionLog(
        dataMarkerterTransation
      );

    // update company token
    const companyTokenCreate = await CompanyTokenRepo.getTokenWithCompany(
      order[0].company._id
    );
    const updateCompanTokenCreate = await CompanyTokenRepo.updateCompanyToken(
      order[0].company._id,
      {
        token: companyTokenCreate.token - tokenAward,
      }
    );

    // create transaction token company
    const dataTransactionTokenCompany = {
      company: order[0].company._id,
      companyToken: companyTokenCreate._id,
      type: "transferAward",
      token: "-" + tokenAward,
      lastBalanceToken: companyTokenCreate.token - tokenAward,
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        id,
    };
    const transactionHistoryCompany =
      await companyTokenTransactionRepo.createTransaction(
        dataTransactionTokenCompany
      );

    // create transaction company
    const dataTransactionCompany = {
      company: order[0].company._id,
      type: "transfer",
      lastBalance: companyTokenCreate.token - tokenAward,
      transferMethod: "token",
      description:
        "bạn đã chuyển " +
        tokenAward +
        " token cho markerter " +
        order[0].marketer._id +
        " từ đơn hàng " +
        id,
      transactionCode: "",
      token: tokenAward,
    };
    const createTransactionCompany =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        dataTransactionCompany
      );
  }

  if (createMarketerTransactionLog && createCompanyTransactionLog) {
    return true;
  } else {
    return false;
  }
};

export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await orderDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const customer = req.body.user._id;
    const arrStatus = await getAllStatus();
    let countE = 0;
    for (const i of arrStatus) {
      const getCountOrder = await orderRepo.getCountOrder(
        i._id,
        getDomain._id,
        customer
      );
      i.count = getCountOrder;
      countE++;
    }
    if (countE === arrStatus.length) {
      res.status(200).json({ data: arrStatus });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getOrderByMarketer = async (req: Request, res: Response) => {
  const marketer = req.body.user._id;
  const domainId = req.body.domain;
  try {
    const result = await orderRepo.orderByMarketer(marketer);
    const arrId = [];
    for (const i of result) {
      arrId.push(new mongoose.Types.ObjectId(i._id));
    }
    const detailOrder = await orderDetailRepo.getAllDetailByOrderId(arrId);
    for (const i of result) {
      i.details = [];
      for (const j of detailOrder) {
        if (i._id.valueOf() === j.order.valueOf()) {
          i.details.push(j);
        }
      }
    }
    const marketerIncome = await marketerIncomeRepo.getByMarketerDomain(
      marketer,
      domainId
    );
    res
      .status(200)
      .json({ status: "success", data: result, marketer: marketerIncome });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getProductSoldByDomain = async (req: Request, res: Response) => {
  const domainId = req.body.domain;
  const offset = parseInt(req.query.offset as string, 10);
  const page = parseInt(req.query.page as string, 10);
  try {
    const total = await domainProductRepo.countByDomain(domainId);
    const productDomain = await domainProductRepo.getAll(
      domainId,
      offset,
      page
    );
    const arrProductDomainId = [];
    for (const i of productDomain) {
      arrProductDomainId.push(new mongoose.Types.ObjectId(i._id));
    }
    const getProduct = await orderDetailRepo.getTotalQuantityByDomain(
      arrProductDomainId
    );
    for (const productD of productDomain) {
      productD.quantity = 0;
      productD.revenue = 0;
      for (const getPro of getProduct) {
        if (getPro._id.valueOf() === productD._id.valueOf()) {
          productD.quantity = getPro.quantity;
          productD.revenue = getPro.revenue;
          break;
        }
      }
    }
    res.status(200).send({
      status: "success",
      data: productDomain,
      total,
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getProductSoldByCompany = async (req: Request, res: Response) => {
  const company = req.body.user._id;
  const offset = parseInt(req.query.offset as string, 10);
  const page = parseInt(req.query.page as string, 10);
  try {
    const allDomainByCompany = await domainRepo.getDomainByCompany(company);

    const arrDomainId = [];
    for (const i of allDomainByCompany) {
      arrDomainId.push(i._id);
    }
    const total = await domainProductRepo.getTotalByArrDomain(arrDomainId);
    const productDomain = await domainProductRepo.getAllByArrDomain(
      arrDomainId,
      offset,
      page
    );

    const arrProductDomainId = [];
    for (const i of productDomain) {
      arrProductDomainId.push(new mongoose.Types.ObjectId(i._id));
    }
    const getProduct = await orderDetailRepo.getTotalQuantityByDomain(
      arrProductDomainId
    );
    for (const productD of productDomain) {
      productD.quantity = 0;
      productD.revenue = 0;
      for (const getPro of getProduct) {
        if (getPro._id.valueOf() === productD._id.valueOf()) {
          productD.quantity = getPro.quantity;
          productD.revenue = getPro.revenue;
          break;
        }
      }
    }
    res.status(200).send({
      status: "success",
      data: productDomain,
      total,
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getReasonCancel = async (req: Request, res: Response) => {
  try {
    const order = req.params.id;
    const cancelOrder = await orderCancelRepo.getByOrder(order);
    if (cancelOrder) {
      res.status(200).send({
        status: "success",
        data: cancelOrder,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
