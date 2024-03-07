const { Product } = require("../models/catalogue");

class AppUtils {
  static async updateInventory(id, quantity) {

    const product = await Product.findById(id);
    if (!product) {
      throw {
        code: 404,
        message: "Item not found",
      };
    }

    // Convert quantity to a numeric value before subtracting
    const updatedQuantity = parseInt(product.quantity) - parseInt(quantity);

    // Update the product with the new quantity
    product.quantity = updatedQuantity;

    // Save the updated product
    await product.save();

    if (!product) {
      throw {
        code: 404,
        message: "Item not found",
      };
    }
    return {
      code: 200,
      message: "item updated successfully",
    };
  }
}

module.exports = AppUtils;
