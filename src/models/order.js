const { default: mongoose } = require("mongoose");

const order = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [order],
  totalPrice: { type: Number },
  date: { type: Date },
});

// orderSchema.pre("save", async function (next) {
//   try {
//     // Calculate totalPrice based on the sum of prices of all orders
//     const totalPrice = this.orders.reduce((acc, cur) => acc + cur.price, 0);

//     // Update the totalPrice field of the orderSchema document
//     this.totalPrice = totalPrice;

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
