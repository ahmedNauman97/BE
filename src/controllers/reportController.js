const Order  = require("../models/order");
const zHtml = require("./z_html")
const UpdateSerialNumber = require("../utils/updateSerial")

class reportController {
  async createReport(body,user) {
    try {

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      let getData = await Order.find({
          date: {
              $gte: startDate,
              $lt: endDate,
          },
      }).populate("orders.categoryId orders.productId");


      let cash_pin_data = {cash:0,cashTotal:0,pin:0,pinTotal:0}
      for (let index = 0; index < getData.length; index++) {
        if(getData[index].cash){
          cash_pin_data.cash += 1
          cash_pin_data.cashTotal += getData[index].totalPrice
        }else{
          cash_pin_data.pin += 1
          cash_pin_data.pinTotal += getData[index].totalPrice
        }
      }

      // Combine all orders into a single array
      const combinedOrders = getData.reduce((accumulator, currentValue) => {
        accumulator.push(...currentValue.orders);
        return accumulator;
      }, []);

      let zReportData = await UpdateSerialNumber.categories_from_orderList(combinedOrders,getData.length)

      let { count_object, formattedDate, formattedTime } = await UpdateSerialNumber.updateZSerialNumber()

      console.log(cash_pin_data,formattedDate, formattedTime)

      // Total amount
      const totalAmount = zReportData.grandTotalSales;

      // VAT rate (21%)
      const vatRate = 21;

      // Calculate excluding VAT
      const excludingVat = totalAmount / (1 + vatRate / 100);

      // Calculate VAT amount
      const vatAmount = totalAmount - excludingVat;

      let formattedNumber = String(count_object.serialNumber).padStart(3, '0')
      const html_content = zHtml.take_products_generate_z_report(
        zReportData,
        formattedNumber,
        formattedDate,
        formattedTime,
        user.name,
        excludingVat,
        vatAmount,
        totalAmount,
        cash_pin_data,
        true
      )
      
      await UpdateSerialNumber.resetSerialNumber()

      const filePath = 'output.html';
  
      // await UpdateSerialNumber.write_html(filePath,html_content) 
      await UpdateSerialNumber.print_receipt(html_content,filePath,true,500,body.cash)
      return {
        code: 201,
        message: "User Created Successfully",
      };
    } catch (error) {
        console.log("Error",error.message)
        throw {
            code: 403,
            error: error,
        };
    }
  }

  async createReportX(body,user) {
    try {

      console.log(1)
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      let getData = await Order.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate("orders.categoryId")

      let cash_pin_data = {cash:0,cashTotal:0,pin:0,pinTotal:0}
      for (let index = 0; index < getData.length; index++) {
        for (let index_1 = 0; index_1 < getData[index].orders.length; index_1++) {
          
          if(getData[index].cash){
            cash_pin_data.cash += 1
            cash_pin_data.cashTotal += getData[index].orders[index_1].price
          }else{
            cash_pin_data.pin += 1
            cash_pin_data.pinTotal += getData[index].orders[index_1].price
          }

        }
      }
      // Combine all orders into a single array
      const combinedOrders = getData.reduce((accumulator, currentValue) => {
        accumulator.push(...currentValue.orders);
        return accumulator;
      }, []);

      let zReportData = await UpdateSerialNumber.categories_from_orderList(combinedOrders,getData.length)

      let { count_object, formattedDate, formattedTime } = await UpdateSerialNumber.updateXSerialNumber()


      // Total amount
      const totalAmount = zReportData.grandTotalSales;

      // VAT rate (21%)
      const vatRate = 21;

      // Calculate excluding VAT
      const excludingVat = totalAmount / (1 + vatRate / 100);

      // Calculate VAT amount
      const vatAmount = totalAmount - excludingVat;

      let formattedNumber = String(count_object.serialNumber).padStart(6, '0')
      const html_content = zHtml.take_products_generate_z_report(
        zReportData,
        formattedNumber,
        formattedDate,
        formattedTime,
        user.name,
        excludingVat,
        vatAmount,
        totalAmount,
        cash_pin_data,
        false
      )
      
      await UpdateSerialNumber.resetSerialNumber()

      const filePath = 'output.html';
  
      // await UpdateSerialNumber.write_html(filePath,html_content) 
      await UpdateSerialNumber.print_receipt(html_content,filePath,true)
      console.log(6)
      return {
        code: 201,
        message: "User Created Successfully",
      };
    } catch (error) {
        console.log("Error",error.message)
        throw {
            code: 403,
            error: error,
        };
    }
  }
}

module.exports = reportController;
