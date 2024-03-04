const { Product } = require("../models/catalogue");

class AppUtils {
  static async updateInventory(id, quantity) {
    const updateInventory = await Product.findByIdAndUpdate(id, {
      $inc: { quantity: -quantity },
    });
    console.log(updateInventory);
    await updateInventory.save();
    if (!updateInventory) {
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
