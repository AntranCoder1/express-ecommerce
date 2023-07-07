import { Request, Response } from "express";
import * as markerterTokenRepo from "../repositories/markerterToken.repo";
import * as markerterTokenTransactionRepo from "../repositories/markerterTokenTransaction.repo";
import * as markerterTransactionLogRepo from "../repositories/marketerTransactionLog.repo";
import * as marketerWithdrawRepo from "../repositories/marketerWithdrawHistory.repo";
import * as marketerWithdrawHistoryRepo from "../repositories/marketerWithdrawHistory.repo";
import * as marketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";
import * as adminRepo from "../repositories/admin.repo";
import * as H2ExpressWithdrawTokenRepo from "../repositories/H2ExpressWithdrawToken.repo";
import * as H2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTransactionTokenRepo from "../repositories/h2ExpressTokenTransaction.repo";

export const createToken = async (req: Request, res: Response) => {
  try {
    const markerterId = req.body.user._id;
    const token = req.body.token;

    console.log("markerterId", req.body.user);

    const findMarkerterTokenExists = await markerterTokenRepo.findByMarkerterId(
      markerterId
    );

    if (!findMarkerterTokenExists) {
      // create marketer token
      const dataMarkerterToken = {
        company: req.body.user.company,
        markerter: markerterId,
        token,
        description: "Giao dịch thành công",
      };
      const createTokenTransaction = await markerterTokenRepo.createToken(
        dataMarkerterToken
      );

      // create transaction token marketer
      const dataMarkerterTokenTransaction = {
        company: req.body.user.company,
        markerterToken: createTokenTransaction._id,
        type: "deposit",
        token,
        lastBalanceToken: token,
        description: "Bạn đã nap " + token + " token vào tài khoản",
      };
      const createTransaction =
        await markerterTokenTransactionRepo.createTransaction(
          dataMarkerterTokenTransaction
        );

      // transaction log
      const dataTransaction = {
        marketer: markerterId,
        type: "deposit",
        money: 0,
        transferMethod: "token",
        description: "Bạn đã nap " + token + " token vào tài khoản",
        transactionCode: "",
        token,
      };
      const createTransactionLog =
        await markerterTransactionLogRepo.createMarketerTransactionLog(
          dataTransaction
        );
    } else {
      console.log("req.body.user.company", req.body.user.company);
      const updateToken = await markerterTokenRepo.updateToken(
        markerterId,
        req.body.user.company,
        { token: findMarkerterTokenExists.token + token }
      );

      const dataMarkerterTransactionToken = {
        company: req.body.user.company,
        markerterToken: findMarkerterTokenExists._id,
        type: "deposit",
        token,
        lastBalanceToken: findMarkerterTokenExists.token + token,
        description: "Bạn đã nap " + token + " token vào tài khoản",
      };
      const createTransactionToken =
        await markerterTokenTransactionRepo.createTransaction(
          dataMarkerterTransactionToken
        );
      // transaction log
      const dataTransaction = {
        marketer: markerterId,
        type: "deposit",
        money: 0,
        transferMethod: "token",
        description: "Bạn đã nap " + token + " token vào tài khoản",
        transactionCode: "",
        token,
      };
      const createTransactionLog =
        await markerterTransactionLogRepo.createMarketerTransactionLog(
          dataTransaction
        );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const transactionHistory = async (req: Request, res: Response) => {
  try {
    const markerterId = req.body.user._id;
    const status = req.body.status;
    const transactionMethod = req.body.transactionMethod;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const findHistoryTokenMarkerter =
      await markerterTokenRepo.historyTransaction(
        markerterId,
        startDate,
        endDate
      );

    if (findHistoryTokenMarkerter.length > 0) {
      let tokenDeposit = 0;

      for (const i of findHistoryTokenMarkerter[0].historyToken) {
        if (i.type === "deposit") {
          tokenDeposit += i.token;
        }
      }

      res.status(200).send({
        status: "success",
        data: findHistoryTokenMarkerter,
        deposit: tokenDeposit,
        tokenBalance: findHistoryTokenMarkerter[0].token,
      });
    } else {
      res.status(404).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const createWithdraw = async (req: Request, res: Response) => {
  try {
    const markerterId = req.body.user._id;
    const transferMethod = req.body.transferMethod;
    const token = req.body.token;

    const findTokenWithMarkerter = await markerterTokenRepo.findByMarkerterId(
      markerterId
    );

    if (!findTokenWithMarkerter) {
      return res.status(404).send({
        status: "failed",
        message: "bạn chưa có token, vui lòng nạp token để tiến hành giao dịch",
      });
    } else if (findTokenWithMarkerter.token < token) {
      return res.status(400).send({
        status: "failed",
        message:
          "Số dư token không đủ để thực hiện giao dịch, vui lòng nạp thêm token để tiến hành giao dịch",
      });
    } else {
      if (token !== null) {
        const dataWithdraw = {
          markerterId,
          transferMethod,
          description: "Yêu cầu rút",
          token,
        };

        const createRequest =
          await marketerWithdrawHistoryRepo.createMarketerWithdrawHistory(
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

      // const lastBalanceToken = findTokenWithMarkerter.token - token;

      // const updateToken = await markerterTokenRepo.updateToken(
      //   markerterId,
      //   findTokenWithMarkerter.company,
      //   {
      //     token: lastBalanceToken,
      //   }
      // );

      // // create transaction token
      // const dataWithdrawLog = {
      //   company: findTokenWithMarkerter.company,
      //   markerterToken: findTokenWithMarkerter._id,
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
      //   await markerterTokenTransactionRepo.createTransaction(dataWithdrawLog);

      // // create transaction log
      // const dataTransactionLog = {
      //   marketer: markerterId,
      //   type: "withdraw",
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
      //   await markerterTransactionLogRepo.createMarketerTransactionLog(
      //     dataTransactionLog
      //   );

      // // create transaction Withdraw
      // const dataWithdrawMarketer = {
      //   marketer: markerterId,
      //   transferMethod: "token",
      //   transactionCode: "",
      //   description: "Đã xử lý",
      //   token,
      // };
      // const createWithdrawHistory =
      //   await marketerWithdrawRepo.createMarketerWithdrawHistory(
      //     dataWithdrawMarketer
      //   );

      // res.status(200).send({ status: "success" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const withdrawTokenByAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.body.user._id;
    const userId = req.body.userId;
    const maketerWithdrawId = req.body.maketerWithdrawId;
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
      const findTokenCollab = await markerterTokenRepo.findDepositHistory(
        userId
      );

      console.log("findTokenCollab", findTokenCollab);

      const lastToken = findTokenCollab[0].token - token;

      console.log("lastToken", lastToken);

      // update token collab
      const updateTokenCollab = await markerterTokenRepo.updateToken(
        userId,
        findTokenCollab[0].company,
        { token: lastToken }
      );

      // update request
      const updateDesc = await marketerWithdrawHistoryRepo.update(
        maketerWithdrawId,
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
        await markerterTokenTransactionRepo.createTransaction(
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
        await markerterTransactionLogRepo.createMarketerTransactionLog(
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
