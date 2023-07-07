import nodemailer from "nodemailer";
import { loadTemplate } from "./loadTemplate";
import * as dotenv from "dotenv";
dotenv.config();
export default class MailUlti {
  public static order = async (order) => {
    const result: any = { success: false, error: null };
    try {
      const emailAuth = process.env.NODEMAILER_USER?.toString();
      const passwordAuth = process.env.NODEMAILER_PASS?.toString();

      const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: {
          user: emailAuth,
          pass: passwordAuth,
        },
      });

      const fee = order.promos != null ? order.promos.fee : 0;
      const total_payment = order.totalPrice - order.shipping.type.fee + fee;
      let htmlstream = await loadTemplate("order");
      htmlstream = htmlstream.replace(
        "${name_customer}",
        order.customer.fullName
      );
      htmlstream = htmlstream.replace("${domain_name}", order.domain.name);
      htmlstream = htmlstream.replace(
        "${customer_name}",
        order.customer.fullName
      );
      htmlstream = htmlstream.replace(
        "${customer_phone}",
        order.customer.phoneNumber
      );
      htmlstream = htmlstream.replace(
        "${customer_email}",
        order.customer.email
      );
      htmlstream = htmlstream.replace(
        "${customer_email2}",
        order.customer.email
      );
      htmlstream = htmlstream.replace(
        "${receiver_name}",
        order.receiver.fullName
      );
      htmlstream = htmlstream.replace(
        "${receiver_phone}",
        order.receiver.phoneNumber
      );
      htmlstream = htmlstream.replace(
        "${receiver_address}",
        order.receiver.address
      );
      htmlstream = htmlstream.replace("${order_id}", order._id);
      htmlstream = htmlstream.replace("${order_date}", order.createdAt);
      htmlstream = htmlstream.replace(
        "${total_order}",
        numberWithCommas(total_payment)
      );
      htmlstream = htmlstream.replace(
        "${shipping_cost}",
        numberWithCommas(order.shipping.type.fee)
      );
      htmlstream = htmlstream.replace(
        "${discount_cost}",
        order.promos ? numberWithCommas(order.promos.fee) : 0
      );
      htmlstream = htmlstream.replace(
        "${total_payment}",
        numberWithCommas(order.totalPrice)
      );
      const url = "https://" + order.domain.websiteAddress + ".chocangay.com";
      htmlstream = htmlstream.replace("${website_url}", url);
      htmlstream = htmlstream.replace("${website_url2}", url);
      htmlstream = htmlstream.replace("${shop_name}", order.domain.name);

      let product_details = "";
      checkPrice(order.order_details);
      order.order_details.map((detail) => {
        let price = 0;
        if (detail.product_domain.product.isDiscount) {
          price = detail.price;
        } else {
          price = detail.oPrice;
        }
        product_details += `<li>
        <table style="width: 100%; border-bottom: 1px solid #e4e9eb">
          <tbody>
            <tr>
              <td style="width: 100%; padding: 25px 10px 0px 0" colspan="2">
                <div
                  style="
                    float: left;
                    width: 80px;
                    height: 80px;
                    border: 1px solid #ebeff2;
                    overflow: hidden;
                  "
                >
                `;
        if (detail.product_version) {
          product_details += `<img
                          style="max-width: 100%; max-height: 100%"
                          alt="product image"
                          title="product image"
                          src="https://${order.domain.websiteAddress}.chocangay.com/productVersion/image/${detail.product_version.image.name}"
                        />`;
        } else {
          product_details += `<img
                          style="max-width: 100%; max-height: 100%"
                          alt="product image"
                          title="product image"
                          src="https://${order.domain.websiteAddress}.chocangay.com/product/image/${detail.product_domain.product.images[0].name}"
                        />`;
        }
        product_details += `
                </div>
                <div style="margin-left: 100px">
                  <a
                    href="https://${order.domain.websiteAddress}.chocangay.com/chi-tiet-san-pham/${detail.product_domain.product.slug}"
                    style="color: #357ebd; text-decoration: none"
                    target="_blank"
                    >${detail.product_domain.product.name}</a
                  >`;
        if (detail.product_version) {
          product_details += `<p style="color: #678299; margin-bottom: 0; margin-top: 8px">
              Phân loại: ${detail.product_version.attributes}
            </p>`;
        }

        product_details += `</div>
              </td>
            </tr>
            <tr>
              <td style="width: 70%; padding: 5px 0px 25px">
                <div style="margin-left: 100px">
                  ${numberWithCommas(
                    price
                  )} VND <span style="margin-left: 20px">x ${
          detail.quantity
        }</span>
                </div>
              </td>
              <td style="text-align: right; width: 30%; padding: 5px 0px 25px">
                ${numberWithCommas(price * detail.quantity)} VND
              </td>
            </tr>
          </tbody>
        </table>
      </li>`;
      });
      htmlstream = htmlstream.replace("${detail}", product_details);
      // send mail with defined transport object
      await transporter.sendMail({
        from: order.domain.name + "<no-reply@chocangay.com>",
        to: order.customer.email,
        subject: "Xác nhận đơn hàng",
        html: htmlstream,
      });
      result.success = true;
    } catch (err) {
      console.log(err);
      result.error = err;
    }
    return result;
  };
  public static contact = async (data) => {
    const result: any = { success: false, error: null };
    try {
      const emailAuth = process.env.NODEMAILER_USER?.toString();
      const passwordAuth = process.env.NODEMAILER_PASS?.toString();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: emailAuth,
          pass: passwordAuth,
        },
      });

      let htmlstream = await loadTemplate("contact");

      htmlstream = htmlstream.replace("${full_name}", data.fullName);
      htmlstream = htmlstream.replace("${phone_number}", data.phoneNumber);
      htmlstream = htmlstream.replace("${email}", data.email);
      htmlstream = htmlstream.replace("${main_industry}", data.mainIndustry);
      htmlstream = htmlstream.replace("${business_type}", data.businessType);
      htmlstream = htmlstream.replace(
        "${business_registration}",
        data.businessRegistration
      );
      htmlstream = htmlstream.replace("${tax_code}", data.taxCode);
      // send mail with defined transport object
      await transporter.sendMail({
        from: data.fullName + "<no-reply@chocangay.com>",
        to: "hoang@h2-inc.com",
        subject: "Tư vấn",
        html: htmlstream,
      });
      result.success = true;
    } catch (err) {
      console.log(err);
      result.error = err;
    }
    return result;
  };
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const checkPrice = (arrItem: any) => {
  for (const i of arrItem) {
    if (i.product_version) {
      if (i.product_domain.product.isDiscount) {
        i.price =
          i.product_version.price -
          (i.product_version.price * i.product_domain.product.discount) / 100;
      } else {
        i.price = i.product_version.price;
      }
      i.oPrice = i.product_version.price;
    } else {
      if (i.product_domain.product.isDiscount) {
        i.price =
          i.product_domain.domain_price -
          (i.product_domain.domain_price * i.product_domain.product.discount) /
            100;
      } else {
        i.price = i.product_domain.domain_price;
      }
      i.oPrice = i.product_domain.domain_price;
    }
  }
};
