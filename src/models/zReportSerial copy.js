const { default: mongoose } = require("mongoose");

const zReportSerialCopy = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
  dateOfReport: { type: String, required: true },
  timeOfReport: { type: String, required: true },
}, {versionKey: false});

const ZReportSerialCopy = mongoose.model("Z Report Serial Copy", zReportSerialCopy);

module.exports = ZReportSerialCopy;
