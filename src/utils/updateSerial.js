const SerialNumber = require("../models/receiptSerial");
const ZReportSerial = require("../models/zReportSerial");
const ZReportSerialCopy = require("../models/zReportSerial copy");
const XReportSerialCopy = require("../models/xReportSerial copy");
const XReportSerial = require("../models/xReportSerial");
const fs = require('fs');
const axios = require("axios")
const { formattedTimeDateStorage } = require("../utils/getDateTime")


class OrderMiddleware {

    static async categories_from_orderList(combinedOrders,orderLength,actualData=[]) {
        try {
          const groupedCategory = combinedOrders.reduce((accumulator, currentValue) => {
            const categoryId = currentValue.categoryId._id;
                // Check if an entry with the current categoryId exists in the accumulator
                const existingCategory = accumulator.find(item => item.categoryId._id === categoryId);
                if (existingCategory) {
                  // If an entry with the current categoryId exists, push the current order into its orders array
                  existingCategory.orders.push(currentValue);
                } else {
                  // If no entry with the current categoryId exists, create a new entry with the categoryId and the current order
                  accumulator.push({
                    categoryId: currentValue.categoryId,
                    orders: [currentValue]
                  });
                }
                return accumulator;
            }, []);

            // Calculate total sale for each group
            groupedCategory.forEach(group => {
                group.totalSale = group.orders.reduce((total, order) => total + order.price, 0);
            });
            
            // Calculate grandTotal
            const grandTotalSales = actualData.reduce((total, group) => total + group.discountedPrice, 0);
            for (let index = 0; index < combinedOrders.length; index++) {
              combinedOrders[index]["price_quantity"] = 0
            }

            const groupedProduct = combinedOrders.reduce((acc, order) => {
                const foundIndex = acc.findIndex(item => item.productId.equals(order.productId));
                if (foundIndex !== -1) {
                  acc[foundIndex].quantity += order.quantity;
                } else {
                  acc.push({
                    productId: order.productId,
                    name: order.name,
                    quantity: order.quantity,
                    price: order.productId.price,
                    categoryId: order.categoryId,
                  });
                }
                return acc;
            }, []);
            return {orderLength,groupedCategory,grandTotalSales,groupedProduct}
        } catch (error) {
          throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async getPreviousXReportNumber(dateOfReport) {

      // Split the date string by "-" and reverse the array
      const reversedArray = dateOfReport.split("-").reverse();
  
      // Join the reversed array with ":" separator
      const reversedDateString = reversedArray.join(":");
  
      const number = await ZReportSerialCopy.find({
        dateOfReport: reversedDateString
      })
      
      return {count_object:number[0].serialNumber,formattedDate:number[0].dateOfReport,formattedTime:number[0].timeOfReport}
  
    }

    static async updateXSerialNumber() {
      try {
        let count;

        let { formattedDate, formattedTime } = formattedTimeDateStorage()
        const number = await XReportSerialCopy.find()
        
        count = await new XReportSerialCopy({
          serialNumber: number.length + 1,
          dateOfReport:formattedDate,
          timeOfReport: formattedTime
        })

        count.save()

        return {count_object:count.serialNumber,formattedDate,formattedTime}

      } catch (error) {
          throw {
              code: 404,
              message: "Error in Execution",
            };
      }
  }

  static async getPreviousZReportNumber(dateOfReport) {

    // Split the date string by "-" and reverse the array
    const reversedArray = dateOfReport.split("-").reverse();

    // Join the reversed array with ":" separator
    const reversedDateString = reversedArray.join(":");

    const number = await ZReportSerialCopy.find({
      dateOfReport: reversedDateString
    })
    
    return {count_object:number[0].serialNumber,formattedDate:number[0].dateOfReport,formattedTime:number[0].timeOfReport}

  }

  static async updateZSerialNumber() {
      try {
          let count;

          let { formattedDate, formattedTime } = formattedTimeDateStorage()
          const number = await ZReportSerialCopy.find()
          
          count = await new ZReportSerialCopy({
            serialNumber: number.length + 1,
            dateOfReport:formattedDate,
            timeOfReport: formattedTime
          })

          count.save()

          return {count_object:count.serialNumber,formattedDate,formattedTime}

        } catch (error) {
          console.log(error.message)
          throw {
              code: 404,
              message: "Error in Execution",
            };
      }
  }

    static async resetSerialNumber() {
      try {
        const number = await SerialNumber.find()

        let count = await SerialNumber.findByIdAndUpdate(
          number[0]._id,
          {$set: {serialNumber:0}},
          { new: true }
        )
        
        count.save()

      } catch (error) {
          throw {
              code: 404,
              message: "Error in Execution",
            };
      }
    }

    static async updateSerialNumber() {
        try {
            const number = await SerialNumber.find()
            let count;
            let count_object;
            let { formattedDate, formattedTime } = formattedTimeDateStorage()

      
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
            return {count_object,formattedDate,formattedTime}
        } catch (error) {
            throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async print_receipt (html_content,filePath,report=false,width=500,cash = false,SHOP_PRINT = true) {
       
        fs.writeFile(filePath, html_content, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
                try {
                    console.log('HTML file saved successfully!');
                    const htmlContent = fs.readFileSync(filePath, 'utf8');
                    const route = SHOP_PRINT ? process.env.PYTHON_BACKEND : process.env.PYTHON_BACKEND_HOME
                    const response = axios.post(report ? route + "/printReport" : route + "/printReceipt", {
                      htmlContent,
                      width,
                      cash
                    }, {
                      headers: {
                          'Content-Type': 'application/json' // Adjust the content type based on your image type
                      }
                  })
                  console.log("PRINTER RESPONSE")
                } catch (error) {
                  console.log("error",error)
                  throw {
                    code: 404,
                    message: "Error in Execution",
                  };
                }
            }
        });
    }

    static async write_html (filePath,html_content) {

        // File path where you want to save the HTML file
        fs.writeFile(filePath, html_content, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
            console.log('HTML file saved successfully!');
            }
        });

    }

}


module.exports = OrderMiddleware