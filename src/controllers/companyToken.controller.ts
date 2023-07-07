import { Request, Response } from "express";
import * as companyTokenRepo from "../repositories/companyToken.repo";
import * as companyTokenTransactionRepo from "../repositories/companyTokenTransaction.repo";
import * as companyDepositRepo from "../repositories/companyDeposit.repo";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";
import * as CompanyWithdrawHistoryRepo from "../repositories/companyWithdrawHistory.repo";
import * as adminRepo from "../repositories/admin.repo";
import * as H2ExpressWithdrawTokenRepo from "../repositories/H2ExpressWithdrawToken.repo";
import * as H2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTransactionTokenRepo from "../repositories/h2ExpressTokenTransaction.repo";

export const createDeposit = async (req: Request, res: Response) => {
  try {
    const company = req.body.user._id;
    const token = req.body.token;

    const findCompanyToken = await companyTokenRepo.getTokenWithCompany(
      company
    );
    if (!findCompanyToken) {
      const data = {
        company,
        token,
        description: "Giao dịch thành công",
      };
      const createCompanyToken = await companyTokenRepo.createCompanyToken(
        data
      );

      // create transaction history token
      const dataTransaction = {
        company,
        companyToken: createCompanyToken._id,
        type: "deposit",
        token: "+" + token,
        lastBalanceToken: token,
        description: "Bạn đã nap " + token + " token vào tài khoản",
      };
      const createTransaction =
        await companyTokenTransactionRepo.createTransaction(dataTransaction);

      // create transaction deposit
      const dataCompanyDeposit = {
        company,
        type: "deposit",
        orderTransferId: "",
        transferMethod: "token",
        transactionCode: "",
        lastBalance: token,
        status: 0,
        description: "Giao dịch thành công",
        token,
      };
      const createCompanyDeposit =
        companyDepositRepo.createCompanyDeposit(dataCompanyDeposit);

      // create transaction history log company
      const companyTransactionLog = {
        company,
        type: "deposit",
        transferMethod: "token",
        description: "Bạn đã nạp " + token,
        token,
      };
      const createHistoryLog =
        await companyTransactionLogRepo.createCompanyTransactionLog(
          companyTransactionLog
        );
    } else {
      const updateCompanyToken = await companyTokenRepo.updateCompanyToken(
        company,
        { token: findCompanyToken.token + token }
      );

      // create transaction history token
      const dataTransactionToken = {
        company,
        companyToken: findCompanyToken._id,
        type: "deposit",
        token: "+" + token,
        lastBalanceToken: findCompanyToken.token + token,
        description: "Bạn đã nap " + token + " token vào tài khoản",
      };
      const createTransactionToken =
        await companyTokenTransactionRepo.createTransaction(
          dataTransactionToken
        );

      // create transaction deposit
      const dataCompanyDeposit = {
        company,
        type: "deposit",
        orderTransferId: "",
        transferMethod: "token",
        transactionCode: "",
        lastBalance: findCompanyToken.token + token,
        status: 0,
        description: "Giao dịch thành công",
        token,
      };
      const createCompanyDeposit =
        companyDepositRepo.createCompanyDeposit(dataCompanyDeposit);

      // create transaction history log company
      const companyTransactionLog = {
        company,
        type: "deposit",
        lastBalance: findCompanyToken.token + token,
        transferMethod: "token",
        description: "Bạn đã nạp " + token,
        token,
      };
      const createHistoryLog =
        await companyTransactionLogRepo.createCompanyTransactionLog(
          companyTransactionLog
        );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getTokenCompany = async (req: Request, res: Response) => {
  try {
    const getTokens = await companyTokenRepo.findAll();

    if (getTokens) {
      res.status(200).send({ status: "success", token: getTokens[0].token });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const transactionHistory = async (req: Request, res: Response) => {
  try {
    const companyId = req.body.user._id;
    const status = req.body.status;
    const transactionMethod = req.body.transactionMethod;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const findHisyoryTokenCompany = await companyTokenRepo.transactionHistory(
      companyId
    );

    const findTransactionToken =
      await companyTokenTransactionRepo.findByCompanyTokenId(
        findHisyoryTokenCompany[0]._id,
        startDate,
        endDate
      );

    if (findHisyoryTokenCompany.length > 0) {
      let tokenDeposit = 0;

      for (const i of findHisyoryTokenCompany[0].historyToken) {
        if (i.type === "deposit") {
          tokenDeposit += i.token;
        }
      }

      res.status(200).send({
        status: "success",
        data: findTransactionToken,
        deposit: tokenDeposit,
        tokenBalance: findHisyoryTokenCompany[0].token,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createWithdraw = async (req: Request, res: Response) => {
  try {
    const companyId = req.body.user._id;
    const transferMethod = req.body.transferMethod;
    const token = req.body.token;

    const findTokenBalance = await companyTokenRepo.getTokenWithCompany(
      companyId
    );

    if (!findTokenBalance) {
      return res.status(404).send({
        status: "failed",
        message:
          "doanh nghệp của bạn chưa có token, vui lòng nạp token để tiến hành giao dịch",
      });
    } else if (findTokenBalance.token < token) {
      return res.status(400).send({
        status: "failed",
        message:
          "số dư token không đủ để thực hiện giao dịch, vui lòng nạp thêm để tiến hành giao dịch",
      });
    } else {
      if (token !== null) {
        const dataWithdraw = {
          company: companyId,
          transferMethod: "token",
          transactionCode: "",
          status: 0,
          description: "Yêu cầu rút",
          token,
        };

        const createRequest = await CompanyWithdrawHistoryRepo.createWithdraw(
          dataWithdraw
        );

        if (createRequest) {
          res.status(200).send({ status: "success" });
        } else {
          res.status(400).send({
            status: "failed",
            message: "Đã có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ Admin",
          });
        }
      } else {
        res.status(400).send({
          status: "failed",
          message: "Đã có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ Admin",
        });
      }

      // const lastBalanceToken = findTokenBalance.token - token;

      // const updateToken = await companyTokenRepo.updateCompanyToken(companyId, {
      //   token: lastBalanceToken,
      // });

      // // create transaction token
      // const dataWithdrawLog = {
      //   company: companyId,
      //   companyToken: findTokenBalance._id,
      //   type: "withdraw",
      //   token: "-" + token,
      //   lastBalanceToken,
      //   description:
      //     "bạn vừa rút " +
      //     token +
      //     " token thành công số dư token hiện tại của bạn là: " +
      //     lastBalanceToken,
      // };
      // const createTransaction =
      //   await companyTokenTransactionRepo.createTransaction(dataWithdrawLog);

      // // create transaction log
      // const dataTransactionLog = {
      //   company: companyId,
      //   type: "withdraw",
      //   lastBalance: lastBalanceToken,
      //   transferMethod: "token",
      //   description:
      //     "bạn vừa rút " +
      //     token +
      //     " token thành công số dư token hiện tại của bạn là: " +
      //     lastBalanceToken,
      //   transactionCode: "",
      //   token,
      // };
      // const createTransactionLog =
      //   await companyTransactionLogRepo.createCompanyTransactionLog(
      //     dataTransactionLog
      //   );

      res.status(200).send({ status: "success" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const withdrawTokenByAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.body.user._id;
    const userId = req.body.userId;
    const companyWithdrawId = req.body.companyWithdrawId;
    const token = req.body.token;
    const status = req.body.status;

    const findAdmin = await adminRepo.getOne(adminId);

    if (!findAdmin) {
      return res
        .status(400)
        .send({ status: "failed", message: "You not admin" });
    }

    // create withdraw token h2
    const dataWithdraw = {
      user: userId,
      type: "withdraw",
      transferMethod: "token",
      transactionCode: "",
      status,
      description:
        status === 2
          ? "Bạn đã chấp nhập yêu cầu cho user " + userId + " rút " + token
          : status === 4
          ? "từ chối"
          : status === 3
          ? "Xử lỹ lỗi"
          : "",
      token,
    };

    const createWithdrawToken =
      await H2ExpressWithdrawTokenRepo.createWithdrawToken(dataWithdraw);

    // create transaction history h2Express
    const dataTransactioH2 = {
      type: "withdraw",
      transferMethod: "token",
      transactionCode: "",
      description:
        status === 2
          ? "Bạn đã cho phép user " + userId + " rút " + token + " token"
          : status === 4
          ? "từ chối"
          : status === 3
          ? "Xử lỹ lỗi"
          : "",
      token,
    };

    const createTransactionH2 =
      await H2ExpressTransactionRepo.createTransaction(dataTransactioH2);

    if (status === 2) {
      const findTokenCollab = await companyTokenRepo.transactionHistory(userId);

      console.log("findTokenCollab", findTokenCollab);

      const lastToken = findTokenCollab[0].token - token;

      console.log("lastToken", lastToken);

      // update token collab
      const updateTokenCollab = await companyTokenRepo.editToken(
        userId,
        lastToken
      );

      // update request
      const updateDesc = await CompanyWithdrawHistoryRepo.update(
        companyWithdrawId,
        { description: "Đã xử lý" }
      );

      // createTransaction token
      const dataTransactionToken = {
        type: "withdraw",
        token,
        lastBalanceToken: lastToken,
        description: "Bạn đã rút thành công " + token + " token",
      };

      const createTransactionToken =
        await companyTokenTransactionRepo.createTransaction(
          dataTransactionToken
        );

      // create transaction history log
      const dataTransactionLog = {
        collaborator: userId,
        type: "withdraw",
        transferMethod: "token",
        description:
          "bạn đã rút thành công " +
          token +
          " token. Số dư token hiện tại của bạn là: " +
          lastToken,
        transactionCode: "",
        token,
      };
      const createTransactionLog =
        await companyTransactionLogRepo.createCompanyTransactionLog(
          dataTransactionLog
        );

      // create transaction token h2Express
      const dataTransactionTokenH2 = {
        type: "withdraw",
        token,
        description:
          "Bạn đã cho phép user " + userId + " rút " + token + " token",
      };

      const createTransactionTokenH2 =
        await H2ExpressTransactionTokenRepo.createTransaction(
          dataTransactionTokenH2
        );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
