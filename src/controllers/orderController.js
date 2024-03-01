const Order = require("../models/order");

class orderController {
  async createOrder(body, user) {
    try {
      const createOrder = await new Order({
        userId: body.userId,
        date: new Date(),
      });

      await createOrder.save();

      return {
        code: 201,
        message: "Order created successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error.message || "Internal server error",
      };
    }
  }
}

module.exports = orderController;
