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
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [order],
  totalPrice: { type: Number },
  date: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
