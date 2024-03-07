const { default: mongoose } = require("mongoose");

const xReportSerial = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
}, {versionKey: false});

const XReportSerial = mongoose.model("X Report Serial", xReportSerial);

module.exports = XReportSerial;
