const Order = require("../models/order");
const SerialNumber = require("../models/receiptSerial");
const AppUtils = require("../utils/appUtils");
const reHtml = require("./re")
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const axios = require("axios")

async function convertHtmlToImage(htmlContent, outputFile) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content
  await page.setContent(htmlContent);

  // Get the total height of the content
  const bodyHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
  });

  // Set the viewport height to the height of the content
  await page.setViewport({ width: 1920, height: bodyHeight });

  // Capture a screenshot of the entire page
  await page.screenshot({ path: outputFile });

  await browser.close();
  console.log('HTML converted to image:', outputFile);
}


class orderController {
  async createOrder(body, user) {
    try {
      const number = await SerialNumber.find()
      let count;
      let count_object;
      // Get the current date
      const currentDate = new Date();

      // Format the date as DD:MM:YYYY
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}:${month}:${year}`;

      // Format the time as HH:MM
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      console.log("Current Date (DD:MM:YYYY):", formattedDate);
      console.log("Current Time (HH:MM):", formattedTime);

      if(number.length == 0){
        count = await new SerialNumber({
          serialNumber: 1
        })
        count_object = count
      }else{
        count = await SerialNumber.findByIdAndUpdate(
          number[0]._id,
          {$set: {serialNumber:number[0].serialNumber + 1}},
          { new: true }
        )
        count_object = count
      }
      
      count.save()
      console.log(count_object,formattedDate,formattedTime,user.role)

      let formattedNumber = String(count_object.serialNumber).padStart(6, '0')
      const html_content = reHtml.take_products(
        body.orders,
        body.totalPrice,
        formattedNumber,
        formattedDate,
        formattedTime,
        user.role
        )
      
      // File path where you want to save the HTML file
      const filePath = 'output.html';

      // console.log(html_content,filePath)
      // convertHtmlToPng(html_content,filePath)

      // fs.writeFile(filePath, html_content, (err) => {
      //   if (err) {
      //       console.error('Error writing HTML file:', err);
      //   } else {
      //     console.log('HTML file saved successfully!');
      //   }
      // });

      fs.writeFile(filePath, html_content, (err) => {
          if (err) {
              console.error('Error writing HTML file:', err);
          } else {
              console.log('HTML file saved successfully!');
              const htmlFilePath = "output.html";
              const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

              const outputFilePath = path.join(__dirname, 'output.png');
              convertHtmlToImage(htmlContent, outputFilePath)
                .then(() => {
                  // Read the image file
                  const inputImagePath = path.join(__dirname, 'output.png');
                  const imageData = fs.readFileSync(inputImagePath);

                  axios.post("https://hear-eat-celebs-transaction.trycloudflare.com/printReceipt", imageData, {
                      headers: {
                          'Content-Type': 'image/png' // Adjust the content type based on your image type
                      }
                  })
                })
                .catch((error) => {
                    console.error('Error converting HTML to image:', error);
                });
              
          }
      });
      
      
      
      //   const createOrder = await new Order({
      //     userId: user._id,
      //     date: new Date(),
      //     totalPrice: body.totalPrice,
      //     orders: [...body.orders],
      //   });
      //   const updateInventory = body.orders.map(async (order) => {
      //     const findProduct = await AppUtils.updateInventory(
      //       order.productId,
      //       order.quantity
      //     );
      //     return findProduct;
      //   });
      //   await Promise.all(updateInventory);
      //   await createOrder.save();

      return {
        code: 201,
        message: "Order created successfully",
      };
    } catch (error) {
      console.log("ERROR",error.message)
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
