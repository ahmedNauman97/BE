const SerialNumber = require("../models/receiptSerial");
const ZReportSerial = require("../models/zReportSerial");
const XReportSerial = require("../models/xReportSerial");
const fs = require('fs');
const axios = require("axios")
const { formattedTimeDateStorage } = require("../utils/getDateTime")


class OrderMiddleware {

    static async categories_from_orderList(combinedOrders,orderLength) {
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
            
            // Using reduce with if-else to sum even and odd numbers separately
            const cash_pin_total = groupedCategory.reduce((accumulator, order) => {
              if (order.cash) {
                accumulator.cash += 1;
                accumulator.cashTotal += order.price; 
              } else {
                accumulator.pin += 1;
                accumulator.pinTotal += order.price; 
              }
              
              return accumulator;
            }, { cash: 0, cashTotal:0, pin: 0, pinTotal: 0 });
            
            // Calculate grandTotal
            const grandTotalSales = groupedCategory.reduce((total, group) => total + group.totalSale, 0);

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
                    price: order.price,
                    categoryId: order.categoryId,
                  });
                }
                return acc;
            }, []);
            
           


            return {orderLength,groupedCategory,grandTotalSales,groupedProduct}
        } catch (error) {
          console.log("NAUMAN")
            throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async updateXSerialNumber() {
      try {
          const number = await XReportSerial.find()
          let count;
          let count_object;
          let { formattedDate, formattedTime } = formattedTimeDateStorage()
    
          if(number.length == 0){
            count = await new XReportSerial({
              serialNumber: 1
            })
            count_object = count
          }else{
            count = await XReportSerial.findByIdAndUpdate(
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

    static async updateZSerialNumber() {
        try {
            const number = await ZReportSerial.find()
            let count;
            let count_object;
            let { formattedDate, formattedTime } = formattedTimeDateStorage()

      
            if(number.length == 0){
              count = await new ZReportSerial({
                serialNumber: 1
              })
              count_object = count
            }else{
              count = await ZReportSerial.findByIdAndUpdate(
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

    static async print_receipt (html_content,filePath,report=false,width=500) {
       
        fs.writeFile(filePath, html_content, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
                console.log('HTML file saved successfully!');
                const htmlContent = fs.readFileSync(filePath, 'utf8');
                axios.post(report ? process.env.PYTHON_BACKEND + "/printReport" : process.env.PYTHON_BACKEND + "/printReceipt", {
                  htmlContent,
                  width
                }, {
                  headers: {
                      'Content-Type': 'application/json' // Adjust the content type based on your image type
                  }
              })
            }
        });
    }

    static async write_html (filePath,html_content) {

        console.log("JDJD")
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