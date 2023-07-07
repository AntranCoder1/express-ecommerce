import crypto from "crypto";
import express from "express";
const app = express();
// https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
// parameters
const momoRequest = (amount, redirect, ipn) => {
  const partnerCode = "MOMOZ1VC20220104";
  const accessKey = "Bm9fb286Nm3bh0FY";
  const secretkey = "A2ZodrcMQZgR167zA9mudxVTomtkIFMU";
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const orderInfo = "Nạp tiền";
  const redirectUrl = redirect;
  const ipnUrl = ipn;
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  const requestType = "captureWallet";
  const extraData = ""; // pass empty value if your merchant does not have stores

  // before sign HMAC SHA256 with format
  // accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  // json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: "vi",
  });
  // Create the HTTPS objects
  return { str: requestBody, orderId };
};

export default momoRequest;
