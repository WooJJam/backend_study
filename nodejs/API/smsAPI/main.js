const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 4000;
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

function send_message() {
    try{
        const serviceId = process.env.SENS_SERVICE_ID
        const accessKey = process.env.SENS_ACCESS_KEY_ID;
        const secretKey = process.env.SENS_SECRET_KEY;
        const callNumber = process.env.SENS_PHONE_NUMBER;
        const date = Date.now().toString(); 
        var space = " ";
        var newLine = "\n";
        var method = "POST";
        var content = "Test용인데 왜 안되는건데 진짜 이해를 못하겠네";
        var url2 = `/sms/v2/services/${serviceId}/messages`;
    
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);
    
        var hash = hmac.finalize();
        const signature = hash.toString(CryptoJS.enc.Base64);
    
        axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`,{
                type: "SMS",
                countryCode: "82",
                from: callNumber,
                content: "강병준씨발",
                 messages: [
                {
                    to: callNumber,
                },
            ]
    },{
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
            },
        });
            return res.status(200).json({message:"SMS sent"});
        } catch(err) {
            console.log(err);
        }
}

app.get('/', (req,res) => {
    console.log(serviceId);
    console.log(accessKey);
    console.log(secretKey);
    console.log(callNumber);
    res.send('<h1>서버연결됨</h1>')
})

app.get('/sms', async (req,res) => {

    await send_message();
})

app.listen(port, ()=>console.log("Server Connected..."));