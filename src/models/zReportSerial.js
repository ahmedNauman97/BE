const { default: mongoose } = require("mongoose");

const zReportSerial = new mongoose.Schema({
  serialNumber: { type: Number, required: true, default: 000000 },
}, {versionKey: false});

const ZReportSerial = mongoose.model("Z Report Serial", zReportSerial);

module.exports = ZReportSerial;
