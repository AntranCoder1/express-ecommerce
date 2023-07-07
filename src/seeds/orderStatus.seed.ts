/**
 * Chờ xác nhận - Pending
 * Đã xác nhận - Verified
 * Chuẩn bị hàng - Packing
 * Đang giao - Delivering
 * Đã giao - Delivered
 * Trả hàng - Return
 * Hoàn tiền - Refund
 */
export const orderStatuses = [
  {
    keyword: "pending",
    name: "Chờ xác nhận",
    modifyOrder: {
      receiver: true,
      paymentMethod: true,
      promoCodes: true,
      products: false,
      shippingUnit: true,
    },
  },
  {
    keyword: "verified",
    name: "Đã xác nhận",
    modifyOrder: {
      receiver: false,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: true,
    },
  },
  {
    keyword: "packing",
    name: "Đang đóng gói",
    modifyOrder: {
      receiver: false,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: true,
    },
  },
  {
    keyword: "delivering",
    name: "Đang vận chuyển",
    modifyOrder: {
      receiver: false,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: false,
    },
  },
  {
    keyword: "delivered",
    name: "Đã giao hàng",
    modifyOrder: {
      receiver: false,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: false,
    },
  },
  {
    keyword: "canceled",
    name: "Đã hủy",
    modifyOrder: {
      receiver: false,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: false,
    },
  },
  {
    keyword: "return",
    name: "Hàng trả về",
    modifyOrder: {
      receiver: true,
      paymentMethod: false,
      promoCodes: false,
      products: false,
      shippingUnit: false,
    },
  },
  {
    keyword: "refund",
    name: "Hoàn tiền",
    modifyOrder: {
      receiver: true,
      paymentMethod: false,
      promoCodes: false,
      products: true,
      shipingUnit: false,
    },
  },
];
