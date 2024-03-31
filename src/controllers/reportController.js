const Order  = require("../models/order");
const zHtml = require("./z_html")
const UpdateSerialNumber = require("../utils/updateSerial")

class reportController {
  async createReport(body,user) {
    try {

      let startDate = new Date();
      if(body.dateSelected){
        startDate = new Date(body.dateSelected);
      }

     // Set the time to 00:00:00
      startDate.setHours(1);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      let getData = await Order.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate("orders.categoryId orders.productId");

      if(!getData.length){
        return {
          code: 202,
          message: "No Data to be Found",
        };
      }

      let cash_pin_discount_data = {cash:0,cashTotal:0,pin:0,pinTotal:0,discount:0,discountTotal:0}
      for (let index = 0; index < getData.length; index++) {
        if(getData[index].cash){
          cash_pin_discount_data.cash += 1
          cash_pin_discount_data.cashTotal += getData[index].discountedPrice
        }else{
          cash_pin_discount_data.pin += 1
          cash_pin_discount_data.pinTotal += getData[index].discountedPrice
        }
        if (getData[index].discount > 0 ){
          cash_pin_discount_data.discount += 1
          cash_pin_discount_data.discountTotal += getData[index].discount
        }
      } 

      // let cash = {cash:0,order:0}
      // let total;
      // for (let index = 0; index < getData.length; index++) {
      //   let current = 0;
      //   for (let index1 = 0; index1 < getData[index].orders.length; index1++) {
      //     total = getData[index].orders[index1].price
      //     current += total
      //   }
      //   cash.cash += getData[index].discountedPrice
      //   cash.order += current
      //   if(getData[index].discountedPrice !== getData[index].totalPrice){
      //     console.log("FIRST",getData[index]._id.toString(), getData[index].discountedPrice, current, getData[index].discount)
      //     getData[index].discountedPrice = current
      //     getData[index].save()
      //   }
      // } 

      // console.log(cash)

      // Combine all orders into a single array
      const combinedOrders = getData.reduce((accumulator, currentValue) => {
        accumulator.push(...currentValue.orders);
        return accumulator;
      }, []);

      let zReportData = await UpdateSerialNumber.categories_from_orderList(combinedOrders,getData.length,getData)
      
      let count_format_time = {}

      if(body.dateSelected){
        count_format_time = await UpdateSerialNumber.getPreviousZReportNumber(body.dateSelected)
      }else{
        count_format_time = await UpdateSerialNumber.updateZSerialNumber()
      }

      // Total amount
      const totalAmount = zReportData.grandTotalSales;

      // VAT rate (21%)
      const vatRate = 21;

      // Calculate excluding VAT
      const excludingVat = totalAmount / (1 + vatRate / 100);

      // Calculate VAT amount
      const vatAmount = totalAmount - excludingVat;
      let formattedNumber = String(count_format_time.count_object).padStart(3, '0')
      const html_content = zHtml.take_products_generate_z_report(
        zReportData,
        formattedNumber,
        count_format_time.formattedDate,
        count_format_time.formattedTime,
        user.name,
        excludingVat,
        vatAmount,
        totalAmount,
        cash_pin_discount_data,
        true,
      )
      
      await UpdateSerialNumber.resetSerialNumber()

      const filePath = 'output.html';
  
      // await UpdateSerialNumber.write_html(filePath,html_content) 
      await UpdateSerialNumber.print_receipt(html_content,filePath,true,500,body.cash)

      return {
        code: 201,
        message: "Report Created Successfully",
      };
    } catch (error) {
        throw {
            code: 403,
            error: error,
        };
    }
  }

  async createReportX(body,user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only admin can get access",
        };
      }

      let startDate = new Date();
      if(body.dateSelected){
        startDate = new Date(body.dateSelected);
      }
      startDate.setHours(1, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      let getData = await Order.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate("orders.categoryId orders.productId")

      if(!getData.length){
        return {
          code: 202,
          message: "No Data to be Found",
        };
      }

      let cash_pin_discount_data = {cash:0,cashTotal:0,pin:0,pinTotal:0,discount:0,discountTotal:0}
      for (let index = 0; index < getData.length; index++) {
        if(getData[index].cash){
          cash_pin_discount_data.cash += 1
          cash_pin_discount_data.cashTotal += getData[index].discountedPrice
        }else{
          cash_pin_discount_data.pin += 1
          cash_pin_discount_data.pinTotal += getData[index].discountedPrice
        }
        if (getData[index].discount > 0 ){
          cash_pin_discount_data.discount += 1
          cash_pin_discount_data.discountTotal += getData[index].discount
        }
      } 
      // Combine all orders into a single array
      const combinedOrders = getData.reduce((accumulator, currentValue) => {
        accumulator.push(...currentValue.orders);
        return accumulator;
      }, []);

      let zReportData = await UpdateSerialNumber.categories_from_orderList(combinedOrders,getData.length,getData)

      let count_format_time = {}

      if(body.dateSelected){
        count_format_time = await UpdateSerialNumber.getPreviousXReportNumber(body.dateSelected)
      }else{
        count_format_time = await UpdateSerialNumber.updateXSerialNumber()
      }

      // Total amount
      const totalAmount = zReportData.grandTotalSales;

      // VAT rate (21%)
      const vatRate = 21;

      // Calculate excluding VAT
      const excludingVat = totalAmount / (1 + vatRate / 100);

      // Calculate VAT amount
      const vatAmount = totalAmount - excludingVat;

      let formattedNumber = String(count_format_time.count_object).padStart(3, '0')
      const html_content = zHtml.take_products_generate_z_report(
        zReportData,
        formattedNumber,
        count_format_time.formattedDate,
        count_format_time.formattedTime,
        user.name,
        excludingVat,
        vatAmount,
        totalAmount,
        cash_pin_discount_data,
        false
      )
      
      await UpdateSerialNumber.resetSerialNumber()

      const filePath = 'output.html';
  
      // await UpdateSerialNumber.write_html(filePath,html_content) 
      await UpdateSerialNumber.print_receipt(html_content,filePath,true)
      return {
        code: 201,
        message: "Report Created Successfully",
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
