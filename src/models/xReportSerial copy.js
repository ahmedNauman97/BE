const { default: mongoose } = require("mongoose");

const xReportSerialCopy = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
  dateOfReport: { type: String, required: true },
  timeOfReport: { type: String, required: true },
}, {versionKey: false});

const XReportSerialCopy = mongoose.model("X Report Serial Copy", xReportSerialCopy);

module.exports = XReportSerialCopy;
