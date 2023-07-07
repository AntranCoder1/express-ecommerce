import { Request, Response } from "express";
import * as collaboratorIncomeRepo from "../repositories/collaboratorIncome.repo";
import * as collaboratorOrderRepo from "../repositories/collaboratorOrder.repo";
import * as collaboratorTokenRepo from "../repositories/collaboratorToken.repo";
import * as collaboratorWithdrawHistoryRepo from "../repositories/collaboratorWithdrawHistory.repo";

export const getAllOrderByCollaborator = async (
  req: Request,
  res: Response
) => {
  try {
    const collaborator = req.body.user._id;
    const domain = req.body.domain;
    const status = req.body.status;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const order = await collaboratorOrderRepo.getByCollaborator(
      collaborator,
      domain,
      status,
      startDate,
      finishDate
    );
    const income = await collaboratorIncomeRepo.getByCollaborator(collaborator);

    const deposit = await collaboratorTokenRepo.findDepositHistoryToken(
      collaborator
    );

    let depositToken = 0;
    let incomeToken = 0;

    for (const i of deposit[0].transactionHistory) {
      if (i.type === "deposit") {
        depositToken += i.token;
      } else if (i.type === "award") {
        incomeToken += i.token;
      }
    }

    let withdraw = 0;

    const findWithdraw =
      await collaboratorWithdrawHistoryRepo.findAllWithdrawToken(collaborator);

    if (findWithdraw.length > 0) {
      for (const i of findWithdraw) {
        withdraw += i.token;
      }
    }

    if (order) {
      res.status(200).send({
        status: "success",
        data: order,
        income,
        depositToken,
        surplus: deposit[0].token,
        incomeToken,
        withdrawToken: withdraw,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
