const Order = require("../models/order");
const AppUtils = require("../utils/appUtils");
const reHtml = require("./re")
const UpdateSerialNumber = require("../utils/updateSerial")
const { ObjectId } = require('mongoose');

class orderController {
  async createOrder(body, user) {
    try {
      
      let { count_object, formattedDate, formattedTime } = await UpdateSerialNumber.updateSerialNumber()

      let formattedNumber = String(count_object.serialNumber).padStart(6, '0')
      const html_content = reHtml.take_products(
        body.orders,
        body.totalPrice,
        formattedNumber,
        formattedDate,
        formattedTime,
        user.name,
        body.cash
      )
    
      const filePath = 'output.html';

      // await UpdateSerialNumber.write_html(filePath,html_content)
      await UpdateSerialNumber.print_receipt(html_content,filePath,false, 350)
      
      const currentDate = new Date(); // Get current date
      currentDate.setTime(currentDate.getTime() + (1 * 60 * 60 * 1000));
      
      const previousDate = new Date(currentDate); // Create a new date object based on the current date
      previousDate.setDate(currentDate.getDate() - 2); // Subtract the specified number of days from the current date

      const createOrder = await new Order({
        userId: user._id,
        date: currentDate,
        totalPrice: body.totalPrice,
        orders: [...body.orders],
        cash:body.cash
      });

      // **** This is the function of inventory **** //
      // const updateInventory = body.orders.map(async (order) => {
      //   const findProduct = await AppUtils.updateInventory(
      //     order.productId,
      //     order.quantity
      //   );
      //   return findProduct;
      // });
      // await Promise.all(updateInventory);
      
      await createOrder.save();

      return {
        code: 201,
        message: "Order created successfully",
      };
    } catch (error) {
      console.log("ERROR",error)
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
        const startDate = new Date(query.date);
        startDate.setTime(startDate.getTime() + (1 * 60 * 60 * 1000));
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        totalPages = 1
        getData = await Order.find({
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        })
      } else {
        totalPages = (await Order.find()).length;
        getData = await Order.find()
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
      const currentDate = new Date();
      currentDate.setTime(currentDate.getTime() + (1 * 60 * 60 * 1000));

      const todayDate = currentDate.toISOString().split("T")[0];
      const todayOrders = data.filter(
        (item) => item.date.toISOString().split("T")[0] === todayDate
      );
      const preDate = new Date(currentDate);
      preDate.setDate(currentDate.getDate() - 1);
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

  async deleteEnteries(orders,user) {
    try {
        const idsArray = orders.map(order => order._id);
        // Convert the array of strings to an array of ObjectId
        const objectIdsToDelete = idsArray.map(id => new ObjectId(id));
        // Delete documents from the collection based on the provided IDs
        const result = await Order.deleteMany({ _id: { $in: idsArray } });
        console.log(result)
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
