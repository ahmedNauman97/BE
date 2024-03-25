const { default: mongoose } = require("mongoose");

const order = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
}, {versionKey: false}
);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [order],
  totalPrice: { type: Number },
  serialNumber: { type: Number },
  date: { type: Date },
  cash: { type: Boolean, required: true, default: true },
}, {versionKey: false});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
