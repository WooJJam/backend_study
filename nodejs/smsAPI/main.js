const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 4000;
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const serviceId = process.env.SENS_SERVICE_Id
const accessKey = process.env.SENS_ACCESS_KEY_ID;
const secretKey = process.env.SENS_SECRET_KEY;
const callNumber = process.env.SENS_PHONE_NUMBER;
const finErrCode = 404;
var date = Date.now().toString();

function makeSignature() {
	var space = " ";
	var newLine = "\n";
	var method = "post";
	var url = `sms/v2/services/${serviceId}/messages`;
	var timestamp = date;

	var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
	hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

	var hash = hmac.finalize();

	return hash.toString(CryptoJS.enc.Base64);
}

app.get('/', (req,res) => {
    res.send('<h1>서버연결됨</h1>')
})

app.get('/sms', async (req,res) => {
    const signature = makeSignature
    const serviceId = process.env.SENS_SERVICE_Id;

    var result = await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`,{
            type: "SMS",
            countryCode: "82",
            from: callNumber,
            contnet: "Test용입니다.",
            messages: [{
                to: '01028187305'
            }],
    },{
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-apigw-timestamp': date,
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-signature-v2': signature
        },
    }).then(result => {
        res.json(result.data);
    }).catch(err =>{
        console.log(err);
    })
    return finErrCode;
})

app.listen(port, ()=>console.log("Server Connected..."));