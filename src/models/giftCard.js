const { default: mongoose } = require("mongoose");

const giftCardSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  serialNumber: { type: Number, required: true, default: 000000 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{
  versionKey: false
});



const Gift = mongoose.model("Gift Card", giftCardSchema);

module.exports = Gift;
