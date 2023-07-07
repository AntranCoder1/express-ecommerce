import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import * as jwt from "jsonwebtoken";
import * as ctrl from "./controllers/customer.controller";
dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb" }));

//#region Mongo Atlas
mongoose.connect(process.env.DB_CONNECTION as string, () => {
  console.log("Database connected.");
});
//#endregion
// configure middlewares
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});
//#region Routes
import areaRoute from "./routes/area.route";
import bankRoute from "./routes/bank.route";
import bankBranchRoute from "./routes/bankBranch.route";
import companyRoute from "./routes/company.route";
import companyDepositRoute from "./routes/companyDeposit.route";
import companyTransferRoute from "./routes/companyTransfer.route";
import companyTransactionLogRoute from "./routes/companyTransactionLog.route";

import creditCardRoute from "./routes/creditCard.route";
import devAnnounceRoute from "./routes/devAnnounce.route";
import devRoute from "./routes/dev.route";
import domainRoute from "./routes/domain.route";
// Marketers
import marketerRoute from "./routes/marketer.route";
import marketerWithdrawHistoryRoute from "./routes/marketerWithdrawHistory.route";
import marketerTransactionRoute from "./routes/marketerTransaction.route";
// Momo
import momoBusinessRoute from "./routes/momoBusiness.route";
// Products
import productCategoryRoute from "./routes/productCategory.route";
import productRoute from "./routes/product.route";
import productSubCategoryRoute from "./routes/productSubCategory.route";
import productTechnicalSampleRoute from "./routes/productTechnicalSample.route";
import productVersionRoute from "./routes/productVersion.route";
import productVariantRoute from "./routes/productVariant.route";
import productVariantSampleRoute from "./routes/productVariantSample.route";
// Domain product
import domainProductRoute from "./routes/domainProduct.route";
import domainCategoryRoute from "./routes/domainCategory.route";
import domainSubCategoryRoute from "./routes/domainSubCategory.route";
// Domain blog
import domainBlogRoute from "./routes/blog.route";
import domainBlogCategoryRoute from "./routes/blogCategory.route";

// Orders
import orderRoute from "./routes/order.route";
import orderRefundRoute from "./routes/orderRefund.route";
import orderStatusRoute from "./routes/orderStatus.route";
// Customers
import customerRoute from "./routes/customer.route";
import customerFavouriteRoute from "./routes/customerFavourite.route";
import receiverRoute from "./routes/receiver.route";
// Delivers
import deliverRoute from "./routes/deliver.route";
import deliverTypeRoute from "./routes/deliverType.route";
// Static files
import staticRoute from "./routes/static.route";
import permissionRoute from "./routes/permission.route";
import featuredProductRoute from "./routes/featuredProduct.route";
import topSearchRoute from "./routes/topSearch.router";
import brandRoute from "./routes/brand.route";
import cartRoute from "./routes/cart.route";
import promoCodeRoute from "./routes/promoCode.route";
import eventRoute from "./routes/event.route";
import linkDomainRoute from "./routes/product-link-domain.route";
import collaboratorRoute from "./routes/collaborator.route";
import collaboratorDomainRoute from "./routes/collaboratorDomain.route";
import collaboratorProductRoute from "./routes/collaboratorProduct.route";
import collaboratorOrderRoute from "./routes/collaboratorOrder.route";
import contactRoute from "./routes/contact.route";
import collaboratorWithdrawHistoryRoute from "./routes/collaboratorWithdrawHistory.route";
import collaboratorTransactionLogRoute from "./routes/collaboratorTransactionLog.route";
import collaboratorToken from "./routes/collaboratorToken.route";
import markerterToken from "./routes/markerterToken.route";

import companyTokenRoute from "./routes/companyToken.route";
import productConfigTokenRoute from "./routes/productConfigToken.route";
import customerTransactionRoute from "./routes/customerTransactionLog.router";
import adminTransactionRoute from "./routes/adminTransactionLog.route";
import customerWithdrawRoute from "./routes/customerWithdraw.route";
import customerDepositRoute from "./routes/customerDeposit.route";
import customerIncomeRoute from "./routes/customerIncome.route";
import maketerDepositRoute from "./routes/maketerDeposit.route";
import collaboratorDepositRoute from "./routes/collaboratorDeposit.route";
import reviewRoute from "./routes/review.route";

import adminRoute from "./routes/admin.route";
// App uses
app.use("/area", areaRoute);
app.use("/bank", bankRoute);
app.use("/bankBranch", bankBranchRoute);
app.use("/blog", domainBlogRoute);
app.use("/blogCategory", domainBlogCategoryRoute);
app.use("/company", companyRoute);
app.use("/companyDeposit", companyDepositRoute);
app.use("/companyTransfer", companyTransferRoute);
app.use("/companyTransaction", companyTransactionLogRoute);
app.use("/creditCard", creditCardRoute);
app.use("/customer", customerRoute);
app.use("/customerFavourite", customerFavouriteRoute);
app.use("/deliver", deliverRoute);
app.use("/deliverType", deliverTypeRoute);
app.use("/dev", devRoute);
app.use("/devAnnounce", devAnnounceRoute);
app.use("/domain", domainRoute);
app.use("/domainProduct", domainProductRoute);
app.use("/domainCategory", domainCategoryRoute);
app.use("/domainSubCategory", domainSubCategoryRoute);
app.use("/marketer", marketerRoute);
app.use("/marketerWithdrawHistory", marketerWithdrawHistoryRoute);
app.use("/marketerTransaction", marketerTransactionRoute);
app.use("/momoBusiness", momoBusinessRoute);
app.use("/order", orderRoute);
app.use("/orderRefund", orderRefundRoute);
app.use("/orderStatus", orderStatusRoute);
app.use("/product", productRoute);
app.use("/productCategory", productCategoryRoute);
app.use("/productSubCategory", productSubCategoryRoute);
app.use("/productTechnicalSample", productTechnicalSampleRoute);
app.use("/productVersion", productVersionRoute);
app.use("/productVariant", productVariantRoute);
app.use("/productVariantSample", productVariantSampleRoute);
app.use("/receiver", receiverRoute);
app.use("/static", staticRoute);
app.use("/permission", permissionRoute);
app.use("/topSearch", topSearchRoute);
app.use("/featuredProduct", featuredProductRoute);
app.use("/brand", brandRoute);
app.use("/cart", cartRoute);
app.use("/promoCode", promoCodeRoute);
app.use("/event", eventRoute);
app.use("/linkDomain", linkDomainRoute);
app.use("/collaborator", collaboratorRoute);
app.use("/collaboratorDomain", collaboratorDomainRoute);
app.use("/collaboratorProduct", collaboratorProductRoute);
app.use("/collaboratorOrder", collaboratorOrderRoute);
app.use("/contact", contactRoute);
app.use("/collaboratorWithdrawHistory", collaboratorWithdrawHistoryRoute);
app.use("/collaboratorTransactionLog", collaboratorTransactionLogRoute);
app.use("/companyToken", companyTokenRoute);
app.use("/productConfigToken", productConfigTokenRoute);
app.use("/markerterToken", markerterToken);
app.use("/customerTransactionLog", customerTransactionRoute);
app.use("/customerDeposit", customerDepositRoute);
app.use("/customerIncome", customerIncomeRoute);
app.use("/maketerDeposit", maketerDepositRoute);
app.use("/collaboratorDeposit", collaboratorDepositRoute);
app.use("/review", reviewRoute);

app.use("/admin", adminRoute);
app.use("/adminTransaction", adminTransactionRoute);
app.use("/customerWithdraw", customerWithdrawRoute);

app.use("/collaboratorToken", collaboratorToken);
//#endregion

app.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

app.get("/", ctrl.authFacebook);
app.use("", (req: any, res: any) => {
  res.status(200).send("welcome");
});
app.listen(process.env.PORT || 8888, () => {
  console.clear();
  console.log("H2 Express API is running in dev mode.");
});
