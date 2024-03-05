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
  async getOrdersDetail(user, query) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 403,
          message: "Only Admin can access",
        };
      }
      const currentPage = parseInt(query.page);
      const limit = 10;
      let totalPages;
      let getData;
      if (query.date) {
        console.log(query.date);
        const startDate = new Date(query.date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        totalPages = (
          await Order.find({
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          })
        ).length;
        getData = await Order.find({
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        })
          .skip((currentPage - 1) * limit)
          .limit(limit);
      } else {
        totalPages = (await Order.find()).length;
        getData = await Order.find()
          .sort({ date: -1 })
          .skip((currentPage - 1) * limit)
          .limit(limit);
      }
      if (!getData) {
        throw {
          code: 404,
          message: "Data Not Found",
        };
      }
      return {
        code: 200,
        message: "Data Found",
        totalPages: totalPages,
        data: getData,
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error.message || "Internal Server Error",
      };
    }
  }

  async getStatus(user) {
    try {
      const data = await Order.find();
      console.log(new Date().toISOString().split("T")[0]);

      const currentDate = new Date();

      const todayDate = currentDate.toISOString().split("T")[0];
      const todayOrders = data.filter(
        (item) => item.date.toISOString().split("T")[0] === todayDate
      );
      const preDate = new Date(currentDate);
      preDate.setDate(currentDate.getDate() - 1);
      console.log("done", preDate);
      const preDay = data.filter(
        (item) =>
          item.date.toISOString().split("T")[0] ===
          preDate.toISOString().split("T")[0]
      );

      return {
        code: 200,
        today: todayOrders,
        preDay: preDay,
        totalOrders: data.length,
      };
    } catch (error) {
      console.error(error);

      throw {
        code: 403,
        error: error || "Internal Server Error",
      };
    }
  }
}

module.exports = orderController;
