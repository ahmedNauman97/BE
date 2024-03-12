
const gift_receipt = (amount,serial,date,time) => {
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
                display: flex;
                justify-content: center;
                font-size: 30px;
                margin-top: 10px;
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
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div >
            <div class="header_1">
                <h1 style="margin: 0; font-size:18px">Cadeaubon/tegeedbon ten waarde van</h1>
            </div>
            <div class="address">
                <p style="margin: 0;">€</p>
                <p style="margin: 0 10px;"> ${amount}</p>
            </div>
            <div class="info"  style="margin-bottom: 20px;">
                <p style="margin-bottom: 0;">Ingangsdatum</p>
                <p style="margin-bottom: 0;">${date}     ${time}</p>
                <p style="margin-bottom: 0;">${serial}</p>
            </div>
            <div class="footer">
                <p style="margin: 0;">6 mandaan geldig</p>
                <p style="margin: 0;">Het bedrag dient in een keer te worden uitgegeven.</p>
                <p style="margin: 0;">Cadeaubonnen of restwaarde ervan zijn niet inwisselbaar</p>
                <p style="margin: 0;">voor geld.</p>
            </div>
    
        </div>
    </body>
    </html>`

    return html_content;

}






module.exports = {gift_receipt}
