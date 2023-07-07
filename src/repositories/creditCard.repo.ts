import { CreditCard } from "../models/creaditCard.model";
export const creditCardGetByUser = async (user: any) => {
  const notShow = {
    number: 0,
    securityNumber: 0,
  };

  const result = await CreditCard.findOne({
    userType: user.type,
    userId: user._id,
  }).select(notShow);
  return result;
};
export const creditCardCreate = async (body: any) => {
  const newCard = new CreditCard(body);
  await newCard.save();
  return newCard._id;
};
export const creditCardUpdate = async (id: any, body: any) => {
  const modified = await CreditCard.findByIdAndUpdate(id, body);
  return modified._id;
};
export const creditCardDelete = async (id: any) => {
  const result = await CreditCard.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Thẻ tín dụng đã được xóa.";
  } else {
    return "Không thẻ tín dụng nào bị xóa.";
  }
};
export const creditCardIsValid = async (card: any) => {
  // Check if credit card is valid. Work later
  return true;
};
