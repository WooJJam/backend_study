const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const mailer = require("nodemailer");

require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res, next) => res.send("<h1>Hi Hello!</h1>"));

app.post("/sendmail", (req,res,next) => {
    const transporter = mailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 465,
        auth: {
            user: process.env.NAVER_EMAIL,
            pass: process.env.NAVER_PASSWORD
        },
    });

    var subject = req.body.subject;
    var to = req.body.to
    var content = req.body.content;

    var mailOptions = {
        from: process.env.NAVER_EMAIL,
        to: to,
        subject: subject,
        html : `<img src=cid:image /> <h1>${content}</h1>`,
        attachments: [{
            filename: 'image.jpeg',
            path: './src/image.jpeg',
            cid: 'image.jpeg'
        }]
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) console.log(err);
        else {console.log('content: '+ info.message);
    }
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))