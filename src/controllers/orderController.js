const Order = require("../models/order");
const AppUtils = require("../utils/appUtils");

class orderController {
  async createOrder(body, user) {
    try {
      const createOrder = await new Order({
        userId: user._id,
        date: new Date(),
        totalPrice: body.totalPrice,
        orders: [...body.orders],
      });
      const updateInventory = body.orders.map(async (order) => {
        const findProduct = await AppUtils.updateInventory(
          order.productId,
          order.quantity
        );
        return findProduct;
      });
      await Promise.all(updateInventory);
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
  async getOrdersDetail(user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 403,
          message: "Only Admin can access",
        };
      }
      const getData = await Order.find();
      if (!getData) {
        throw {
          code: 404,
          message: "Data Not Found",
        };
      }
      return {
        code: 200,
        message: "Data Found",
        data: getData,
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error.message || "Internal Server Error",
      };
    }
  }
}

module.exports = orderController;
