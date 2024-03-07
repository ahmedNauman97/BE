const { default: mongoose } = require("mongoose");

const receiptSerial = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
}, {versionKey: false});

const ReceiptSerial = mongoose.model("Receipt Serial", receiptSerial);

module.exports = ReceiptSerial;
