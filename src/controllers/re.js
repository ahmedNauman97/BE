

const return_product = (product) => {
    return (
        `<div class="products">
            <div>
                <p style="margin: 0;">${product.quantity}     ${product.name}</p>
                <p style="margin: 0;">€ ${product.price.toFixed(2)}</p>
            </div>
        </div>`
    )
}

const take_products = (products,total,serial,date,time,role,cash) => {
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
                max-width: 350px;
                padding: 20px;
            ;
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
            }
            .header_2 {
                text-align: center;
            }
            .header h2 {
            }
            .address {
                text-align: center;
            }
            p {
            }
            .info {
                display: flex;
                justify-content: space-around;
            }
            .products {
                text-align: center;
                border-collapse: collapse;
                width: 100%;
            }
            .products div {
                margin: 0;
                display: flex;
                justify-content: space-between;
                padding: 0px 25px
            }
            .total {
                display: flex;
                justify-content: space-around;
                border-collapse: collapse;
                width: 100%;
            }
            .footer {
                text-align: center;
                width: 100%;
                margin-top:20px;
                font-size:12px;
            }
        </style>
    </head>
    <body>
        <div >
            <div class="header_1">
                <h1 style="margin: 0; font-size:50px">MA CHERIE</h1>
            </div>
            <div class="address">
                <p style="margin: 0;">NOORDMOLENSTRAAT 79 A</p>
                <p style="margin: 0;">3035 RH ROTTERDAM</p>
                <p style="margin: 0;">WHATSAPP; 0684202826</p>
                <h1 style="margin: 0;  font-size:20px">www.macherie010.com</h1>
            </div>
            <div class="info"  style="margin-bottom: 20px;">
                <p style="margin-bottom: 0;">REG</p>
                <p style="margin-bottom: 0;">${role}</p>
                <p style="margin-bottom: 0;">${date}     ${time}</p>
                <p style="margin-bottom: 0;">${serial}</p>
            </div>
            ${products.map(product => return_product(product))}
            <div class="products">
                <div>
                    <p style="margin-bottom: 0;">Total Ex VAT</p>
                    <p style="margin-bottom: 0;">€ ${(total * 0.79).toFixed(2)}</p>
                </div>
            </div>
            <div class="products">
                <div>
                    <p style="margin: 0;">VAT @ 21%</p>
                    <p style="margin: 0;">€ ${(total * 0.21).toFixed(2)}</p>
                </div>
            </div>
            <div class="products">
                <div>
                    <p style="margin: 0;">SUB TOTAL</p>
                    <p style="margin: 0;">€ ${total.toFixed(2)}</p>
                </div>
            </div>
            <div class="products">
                <div>
                    <p style="margin: 0;">${cash ? "CONTANT" : "PIN"}</p>
                    <p style="margin: 0;">€ ${total.toFixed(2)}</p>
                </div>
            </div>
            <div class="footer">
                <p style="margin: 0;">WIJ GEVEN GEEN GELD TERUG</p>
                <p style="margin: 0;">RUILEN BINNEN 8.DAGEN MET BON</p>
                <p style="margin: 0;">SALE ART, MOGEN NIET GERUILD WORDEN</p>
                <p style="margin: 0;">Wij geven geen (was)garantie</p>
                <p style="margin: 0;">BEDANKT VOOR UW AANKOOP</p>
            </div>
    
        </div>
    </body>
    </html>`

    return html_content;

}






module.exports = {take_products}
