const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
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
  description: String,
  barcode: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },

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
