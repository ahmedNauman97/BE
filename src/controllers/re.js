const return_product = (product) => {
    return (
        `<div class="products">
            <div>
                <p>${product.quantity}     ${product.name}</p>
                <p>${product.price}</p>
            </div>
            <div>
                <p>Total Ex VAT</p>
                <p>${(product.price * 0.79).toFixed(2)}</p>
            </div>
            <div>
                <p>VAT @ 21%</p>
                <p>${(product.price * 0.21).toFixed(2)}</p>
            </div>
        </div>`
    )
}

const take_products = (products,total,serial,date,time,role) => {
    const html_content = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                font-weight: 600;
                font-size: 100px;
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
                font-size: 80px;
                font-weight: bold;
            }
            .header_2 {
                text-align: center;
                font-size: 35px;
                margin-bottom: 20px;
                margin-top: -5%;
                font-weight: bold;
            }
            .header h2 {
                margin: 0;
            }
            .address {
                text-align: center;
                margin-top: 50px;
                margin-bottom: 50px;
            }
            .info {
                margin-bottom: 20px;
                display: flex;
                justify-content: space-evenly;
            }
            .products {
                margin-top: 20px;
                text-align: center;
                border-collapse: collapse;
                width: 100%;
            }
            .products div {
                display: flex;
                margin-top: -20px;
                justify-content: space-evenly;
            }
            .total {
                display: flex;
                text-align: center;
                justify-content: space-evenly;
                border-collapse: collapse;
                width: 100%;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                width: 100%;
                font-size: 20px;
            }
        </style>
    </head>
    <body>
        <div >
            <div class="header_1">
                <h3>MA CHERIE</h3>
            </div>
            <div class="header_2">
                <p>www.macherie010.com</p>
            </div>
            <div class="address">
                <p>MA CHERIE</p>
                <p>NOORDMOLENSTRAAT 79 A</p>
                <p>3035 RH ROTTERDAM</p>
                <p>WHATSAPP; 0684202826</p>
            </div>
            <div class="info">
                <p>REG</p>
                <p>${role}</p>
                <p>${date}     ${time}</p>
                <p>${serial}</p>
            </div>
            ${products.map(product => return_product(product))}
            <div class="total">
                <p>SUB TOTAL</p>
                <p>${total}</p>
            </div>
            <div class="total">
                <p>CONTANT</p>
                <p>${total}</p>
            </div>
            <div class="footer">
                <p>WIJ GEVEN GEEN GELD TERUG</p>
                <p>RUILEN BINNEN 8.DAGEN MET BON</p>
                <p>SALE ART, MOGEN NIET GERUILD WORDEN</p>
                <p>Wij geven geen (was)garantie</p>
                <p>BEDANKT VOOR UW AANKOOP</p>
            </div>
    
        </div>
    </body>
    </html>`

    return html_content;

}






module.exports = {take_products}
