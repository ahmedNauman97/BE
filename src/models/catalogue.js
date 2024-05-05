const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sequenceNumber: { type: Number },
  hide:{type: Boolean, required: true, default: false}
  //   products: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Product",
  //     },
  //   ],
},{
  versionKey: false
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequenceNumber: { type: Number },
  description: String,
  barcode: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  hide:{type: Boolean, required: true, default: false},
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
}, {
  // Disable the version key
  versionKey: false
});

const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);

module.exports = { Category, Product };
