const { default: mongoose } = require("mongoose");

const receiptSerial = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
});

const Order = mongoose.model("Receipt Serial", receiptSerial);

module.exports = Order;
