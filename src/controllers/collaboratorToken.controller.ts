import { Request, Response } from "express";
import * as collaboratorTokenRepo from "../repositories/collaboratorToken.repo";
import * as collaboratorTokenTransactionRepo from "../repositories/collaboratorTokenTransaction.repo";
import * as collaboratorTransactionRepo from "../repositories/collaboratorTransactionLog.repo";
import * as collaboratorWithdrawRepo from "../repositories/collaboratorWithdrawHistory.repo";
import * as adminRepo from "../repositories/admin.repo";
import * as H2ExpressWithdrawTokenRepo from "../repositories/H2ExpressWithdrawToken.repo";
import * as H2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTransactionTokenRepo from "../repositories/h2ExpressTokenTransaction.repo";

export const createToken = async (req: Request, res: Response) => {
  try {
    const collaboratorId = req.body.user._id;
    const token = req.body.token;

    const findCollaboratorTokenExists =
      await collaboratorTokenRepo.findTokenWithCollabId(collaboratorId);

    if (!findCollaboratorTokenExists) {
      // create collab token
      const dataToken = {
        collaborator: collaboratorId,
        token,
        description: "Giao dịch thành công",
      };
      const createTokenCollab =
        await collaboratorTokenRepo.createCollaboratorToken(dataToken);

      // create transaction token
      const dataTransaction = {
        collaboratorToken: createTokenCollab._id,
        type: "deposit",
        token: "+" + token,
        lastBalanceToken: token,
        description: "bạn đã nạp " + token + " token vào tài khoản",
      };
      const createTransaction =
        await collaboratorTokenTransactionRepo.createTransaction(
          dataTransaction
        );

      // create transaction history collab
      const dataTransactionHistoryLog = {
        collaborator: collaboratorId,
        type: "deposit",
        transferMethod: "token",
        description: "Bạn đã nạp " + token + " vào tài khoản",
        transactionCode: "",
        token,
      };
      const createTransactionHistory =
        await collaboratorTransactionRepo.createCollaboratorTransactionLog(
          dataTransactionHistoryLog
        );
    } else {
      // update token
      const updateToken = await collaboratorTokenRepo.updateToken(
        findCollaboratorTokenExists.collaborator,
        { token: findCollaboratorTokenExists.token + token }
      );

      // create transaction token
      const dataTransactionToken = {
        collaboratorToken: findCollaboratorTokenExists._id,
        type: "deposit",
        token: "+" + token,
        lastBalanceToken: token,
        description: "bạn đã nạp " + token + " token vào tài khoản",
      };
      const createTransactionToken =
        await collaboratorTokenTransactionRepo.createTransaction(
          dataTransactionToken
        );

      // create transaction history collab
      const dataTransactionHistoryLog = {
        collaborator: collaboratorId,
        type: "deposit",
        transferMethod: "token",
        description: "Bạn đã nạp " + token + " vào tài khoản",
        transactionCode: "",
        token,
      };
      const createTransactionHistory =
        await collaboratorTransactionRepo.createCollaboratorTransactionLog(
          dataTransactionHistoryLog
        );
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const transactionHistory = async (req: Request, res: Response) => {
  try {
    const collabId = req.body.user._id;
    const status = req.body.status;
    const transactionMethod = req.body.transactionMethod;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const findHistory = await collaboratorTokenRepo.findHistoryToken(
      collabId,
      startDate,
      endDate
    );

    if (findHistory) {
      let tokenDeposit = 0;

      for (const i of findHistory[0].transactionHistory) {
        if (i.type === "deposit") {
          tokenDeposit += i.token;
        }
      }
      res.status(200).send({
        status: "success",
        data: findHistory,
        deposit: tokenDeposit,
        tokenBalance: findHistory[0].token,
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
    const collabId = req.body.user._id;
    const token = req.body.token;

    const findTokenWithCollabId =
      await collaboratorTokenRepo.findTokenWithCollabId(collabId);

    if (!findTokenWithCollabId) {
      return res.status(404).send({
        status: "failed",
        message: "bạn chưa có token, vui lòng nạp token để tiến hành giao dịch",
      });
    } else if (findTokenWithCollabId.token < token) {
      return res.status(400).send({
        status: "failed",
        message:
          "Số dư token không đủ để thực hiện giao dịch, vui lòng nạp thêm token để tiến hành giao dịch",
      });
    } else {
      const lastBalanceToken = findTokenWithCollabId.token - token;

      const dataWithdraw = {
        collaborator: collabId,
        transferMethod: "token",
        transactionCode: "",
        status: 0,
        description: "Yêu cầu rút",
        token,
      };

      const createRequest =
        await collaboratorWithdrawRepo.createCollaboratorWithdrawHistory(
          dataWithdraw
        );

      // // create transaction log
      // const dataTransactionLog = {
      //   collaborator: collabId,
      //   type: "withdraw",
      //   transferMethod: "token",
      //   description:
      //     "bạn vừa Yêu cầu rút " +
      //     token +
      //     " token. Số dư token hiện tại của bạn là: " +
      //     lastBalanceToken,
      //   transactionCode: "",
      //   token,
      // };
      // const createTransactionLog =
      //   await collaboratorTransactionRepo.createCollaboratorTransactionLog(
      //     dataTransactionLog
      //   );

      if (createRequest) {
        res.status(200).send({ status: "success" });
      } else {
        res.status(400).send({ status: "failed" });
      }
      // const lastBalanceToken = findTokenWithCollabId.token - token;

      // const updateToken = await collaboratorTokenRepo.updateToken(collabId, {
      //   token: lastBalanceToken,
      // });

      // // create transaction token
      // const dataWithdrawLog = {
      //   collaboratorToken: findTokenWithCollabId._id,
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
      //   await collaboratorTokenTransactionRepo.createTransaction(
      //     dataWithdrawLog
      //   );

      // // create transaction log
      // const dataTransactionLog = {
      //   collaborator: collabId,
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
      //   await collaboratorTransactionRepo.createCollaboratorTransactionLog(
      //     dataTransactionLog
      //   );

      // // create transaction withdraw history
      // const dataWithdrawHistory = {
      //   collaborator: collabId,
      //   transferMethod: "token",
      //   transactionCode: "",
      //   description:
      //     "bạn vừa rút " +
      //     token +
      //     " token thành công số dư token hiện tại của bạn là: " +
      //     lastBalanceToken,
      //   token,
      // };
      // const createWithdrawHistoryTransaction =
      //   await collaboratorWithdrawRepo.createCollaboratorWithdrawHistory(
      //     dataWithdrawHistory
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
    const collabWithdrawId = req.body.collabWithdrawId;
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
      const findTokenCollab =
        await collaboratorTokenRepo.findDepositHistoryToken(userId);

      console.log("findTokenCollab", findTokenCollab);

      const lastToken = findTokenCollab[0].token - token;

      console.log("lastToken", lastToken);

      // update token collab
      const updateTokenCollab = await collaboratorTokenRepo.updateToken(
        userId,
        { token: lastToken }
      );

      // update request
      const updateDesc = await collaboratorWithdrawRepo.update(
        collabWithdrawId,
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
        await collaboratorTokenTransactionRepo.createTransaction(
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
        await collaboratorTransactionRepo.createCollaboratorTransactionLog(
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
