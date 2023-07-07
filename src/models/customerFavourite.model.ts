import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerFavouriteSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "DomainProduct",
      },
    ],
  },
  { timestamps: true }
);
export const CustomerFavourite = mongoose.model(
  "CustomerFavourite",
  CustomerFavouriteSchema,
  "customer_favourites"
);
