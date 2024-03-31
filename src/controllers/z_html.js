const fixed_ttl = (data,serial,excludingVat,vatAmount,totalAmount,zReport) => {
    
    return (
        `
        <div class="section">
            <div class="info"  style="margin-top: 50px;">
                <p style="margin: 0;">${zReport ? "Z" : "X"}</p>
                <p style="margin: 0;">0001011</p>
                <p style="margin: 0;">FIXED TTL</p>
                <p style="margin: 0;">${serial}</p>
            </div>
            <div class="sub_section">
                <div class="sub_info">
                    <p style="margin: 0;">GROSS SALES</p>
                    <p style="margin: 0;">${data.orderLength}</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">NET SALES <span  style="margin-left: 50px;">No</span></p>
                    <p style="margin: 0;">${data.orderLength}</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">CASH IN DRAWER</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">TOTAL EX VAT</p>
                    <p style="margin: 0;">€${(excludingVat).toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">VAT @ 21%</p>
                    <p style="margin: 0;">€${(vatAmount).toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">TOTAL TA</p>
                    <p style="margin: 0;">€${(excludingVat).toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">TOTAL TAX</p>
                    <p style="margin: 0;">€${(vatAmount).toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">TOTAL TURNOVER</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
        `
    )
}

const free_function = (data,serial,excludingVat,vatAmount,totalAmount,cash_pin_data,zReport) => { 
    return (
        `
        <div class="section">
            <div class="info">
                <p style="margin: 0;">${zReport ? "Z" : "X"}</p>
                <p style="margin: 0;">0001012</p>
                <p style="margin: 0;">FREE FUNCTION</p>
                <p style="margin: 0;">${serial}</p>
            </div>
            <div class="sub_section">
                <div class="sub_info">
                    <p style="margin: 0;">CONTANT <span style="margin-left: 50px;">No</span></p>
                    <p style="margin: 0;">${cash_pin_data.cash}</p>
                    <p style="margin: 0;">€${cash_pin_data.cashTotal.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">PIN <span style="margin-left: 50px;">No</span></p>
                    <p style="margin: 0;">${cash_pin_data.pin}</p>
                    <p style="margin: 0;">€${cash_pin_data.pinTotal.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                <p style="margin: 0;">KORTING <span style="margin-left: 50px;">No</span></p>
                <p style="margin: 0;">${cash_pin_data.discount}</p>
                <p style="margin: 0;">€${cash_pin_data.discountTotal.toFixed(2)}</p>
            </div>
            </div>
        </div>
        `
    )
}

const dept = (data, serial, excludingVat, vatAmount, totalAmount,zReport,cash_pin_data) => {

    const category = (val) => {
        return `
            <div class="sub_info">
                <p style="margin: 0;">${val.categoryId.name}</p>
                <p style="margin: 0;">${val.orders.length}</p>
                <p style="margin: 0;">€${(val.totalSale).toFixed(2)}</p>
            </div>
        `;
    };

    return `
        <div class="section">
            <div class="info">
                <p style="margin: 0;">${zReport ? "Z" : "X"}</p>
                <p style="margin: 0;">0001015</p>
                <p style="margin: 0;">DEPT</p>
                <p style="margin: 0;">${serial}</p>
            </div>
            <div class="sub_section">
                ${data.groupedCategory.map((val) => category(val)).join('')} <!-- Join the results to remove line breaks -->
                <div class="sub_info">
                    <p style="margin: 0;">KORTING</p>
                    <p style="margin: 0;">${cash_pin_data.discount}</p>
                    <p style="margin: 0;">- €${(cash_pin_data.discountTotal).toFixed(2)}</p>
                </div>
                <div class="hr-line"></div>
                <div class="sub_info">
                    <p style="margin: 0;">TL</p>
                    <p style="margin: 0;">9</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
};


const cashier = (data,role,serial,excludingVat,vatAmount,totalAmount,zReport) => {
    return (
        `
        <div class="section">
            <div class="info">
                <p style="margin: 0;">${zReport ? "Z" : "X"}</p>
                <p style="margin: 0;">0001017</p>
                <p style="margin: 0;">CASHIER/CLERK</p>
                <p style="margin: 0;">${serial}</p>
            </div>
            <div class="sub_section">
                <div class="hr-line"></div>
                <div class="sub_info">
                    <p style="margin: 0;">${role}</p>
                    <p style="margin: 0;">1</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">GROSS SALES</p>
                    <p style="margin: 0;">${data.orderLength}</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">NET SALES <span style="margin-left: 50px;">No</span></p>
                    <p style="margin: 0;">${data.orderLength}</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
                <div class="sub_info">
                    <p style="margin: 0;">CASH IN DRAWER</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
        `
    )
}

const PLU = (data, serial, excludingVat, vatAmount, totalAmount,zReport,cash_pin_data) => {

    const product = (product) => {
        return `
            <div class="sub_info">
                <p style="margin: 0;">${product.name}</p>
                <p style="margin: 0;">€${(product.price).toFixed(2)}</p>
                <p style="margin: 0;">${product.quantity}</p>
                <p style="margin: 0;">€${(product.price * product.quantity).toFixed(2)}</p>
            </div>
        `;
    };

    return `
        <div class="section">
            <div class="info">
                <p style="margin: 0;">${zReport ? "Z" : "X"}</p>
                <p style="margin: 0;">0001014</p>
                <p style="margin: 0;">PLU</p>
                <p style="margin: 0;">${serial}</p>
            </div>
            <div class="sub_section">
                ${data.groupedProduct.map((val) => product(val)).join('')} <!-- Join the results to remove line breaks -->
                <div class="sub_info">
                    <p style="margin: 0;">KORTING</p>
                    <p style="margin: 0;">${cash_pin_data.discount}</p>
                    <p style="margin: 0;">- €${(cash_pin_data.discountTotal).toFixed(2)}</p>
                </div>
                <div class="hr-line"></div>
                <div class="sub_info">
                    <p style="margin: 0;">TL</p>
                    <p style="margin: 0;">9</p>
                    <p style="margin: 0;">€${totalAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
};

const take_products_generate_z_report = (data,serial,date,time,role,excludingVat,vatAmount,totalAmount,cash_pin_data,zReport = false) => {
    const html_content = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size:30px;
                max-width: 500px;
                padding: 20px;
            }
            .hr-line {
                border-bottom: 10px solid #000; /* Adjust the color and thickness as needed */
                margin: 25px 0px; /* Adjust the margin as needed */
            }
            .container {
                max-width: 400px;
                margin: auto;
                border: 1px solid #ccc;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header_1 {
                text-align: center;
                margin:-35px;

            }
            .header_2 {
                text-align: center;
                font-weight: bold;
            }
            .header h2 {
                margin: 0;
            }
            .address {
                text-align: center;
            }
            .info {
                display: flex;
                justify-content: space-between;
                font-size:20px;
            }
            .sub_info {
                display: flex;
                justify-content: space-between;
                margin:0px
            }
            .products {
                text-align: center;
                border-collapse: collapse;
                width: 100%;
            }
            .products div {
                display: flex;
                justify-content: space-between;
            }
            .total {
                display: flex;
                text-align: center;
                justify-content: space-between;
                border-collapse: collapse;
                width: 100%;
            }
            .section {
                margin-bottom: 50px
            }
            .sub_section {
                margin-top: 25px;
                font-size:20px;
                padding: 0px 25px
            }
        </style>
    </head>
    <body>
        <div>
            <div class="info">
                <p>${"X/Z"}</p>
                <p>${role}</p>
                <p>${date}     ${time}</p>
                <p>${serial}</p>
            </div>
            <div class="header_1">
                <h3>BATCH REPORT 2</h3>
            </div>
            ${fixed_ttl(data,serial,excludingVat,vatAmount,totalAmount,zReport)}
            ${free_function(data,serial,excludingVat,vatAmount,totalAmount,cash_pin_data,zReport)}
            ${dept(data,serial,excludingVat,vatAmount,totalAmount,zReport,cash_pin_data)}
            ${cashier(data,role,serial,excludingVat,vatAmount,totalAmount,zReport)}
            ${PLU(data,serial,excludingVat,vatAmount,totalAmount,zReport,cash_pin_data)}
            <div style="margin-top: 10px;">
                <div class="hr-line"></div>
            </div>
        </div>
    </body>
    </html>`

    return html_content;
 
}


module.exports = {take_products_generate_z_report}
