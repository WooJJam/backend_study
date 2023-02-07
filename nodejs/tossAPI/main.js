const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 4000;
const faker = require('faker');
const connect = require("./Schema/index");
const Product = require("./Schema/Product");
const User = require("./Schema/User");
const axios = require('axios');
const History = require('./Schema/History');
var express_session = require('express-session');
const mailer = require("nodemailer");

require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', './views');

connect();

async function RandomString() {
    return await Math.random().toString(36).substr(2,11);
}

async function sendMail(to, amount, orderid) {
    const transporter = await mailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 465,
         auth: {
            user: process.env.NAVER_EMAIL,
            pass: process.env.NAVER_PASSWORD
        },
    });
    
    var mailOptions = {
        from: process.env.NAVER_EMAIL,
        to: to,
        subject: 'Toss Payment Complete! Jaemin',
        html : `<h4>총 금액: ${amount}<h4>
                <h4>주문번호: ${orderid}<h4>` 
    };
    
    await transporter.sendMail(mailOptions, function(err, info) {
        if(err) console.log(err);
    });
}

app.use(express_session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store:require('mongoose-session')(mongoose),
}))

app.get('/', (req,res) => {
    console.log(req.session);
   
    res.render('main.ejs', {
        email : req.session.email,
        orderid : req.session._id
    });
})

app.post('/register', async(req,res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var phone_number = req.body.phonenumber;

    const result = await User.exists({email: email})
    if(result) {
        res.json("이미 존재하는 이메일입니다.");
    }else {
        console.log("없음");
        const user = new User({
            name: name,
            email : email,
            password : password,
            phone_number : phone_number
        })
        user.save();
        res.json("회원가입 완료.");
    }
})

app.get("/login", (req, res)=> {
    res.render("login.ejs");
})

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email, password: password}).exec((err, result) => {
        console.log(result);
        if(result != null) {
            req.session._id = result._id;
            req.session.email = email;
            console.log("로그인 성공!");
            res.redirect('/');
        } else {
            console.log("존재하지 않는 회원정보 입니다.");
        }
    })
})

app.get('/failed', (req,res) => {
    res.render("<h1>실패ㅠ<h1>");
})

getRandomProduct = async function () {
    const count = await Product.countDocuments();
    const random = Math.floor(Math.random() * count);
    return Product.findOne().skip(random)
}

app.get('/toss', async (req, res) => {

    await getRandomProduct()
    .then(result => {
        product = result
    })
    .catch(err => console.log(err));

    const randomOrderid = await RandomString();

    res.render('index', {
        orderid : randomOrderid,
        price: product.price,
        name: product.name,
        seller: product.seller
    })
})

app.get('/success', async (req,res) => {

    var orderid = req.query.orderId;
    var paymentkey = req.query.paymentKey;
    let amount = parseInt(req.query.amount);
    const base64encoding = await Buffer.from('test_sk_BE92LAa5PVb1k6O7p4W37YmpXyJj:').toString('base64');
    
    const result = await axios.post("https://api.tosspayments.com/v1/payments/confirm", {
        paymentKey: paymentkey,
        orderId: orderid,
        amount: amount
    }, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Basic ${base64encoding}`
    }
    })

    const history = await new History({
        orderId: result.data.orderName,
        orderName : result.data.orderId,
        paymentKey : result.data.paymentKey,
        totalAmount : result.data.totalAmount,
        userId : req.session._id,
        status : result.data.status,
        approvedAt : result.data.approvedAt
    })
    history.save();
    await sendMail(req.session.email, result.data.totalAmount, result.data.orderId);
    res.render('succes.ejs');
})

app.post('/testingProduct', async(req, res) => {
    const seed = req.body.seed;
    var productList = new Array();

    await faker.seed(seed);

    for(var i=0; i<100; i++) {
        var data = new Object;
        var price = faker.commerce.price(5000, 30000, 0);
        var name = faker.commerce.productName();
        var seller = faker.name.findName();
        data.price = price;
        data.name = name;
        data.seller = seller;
        productList.push(data);
        
        const product = new Product({
            price: price,
            name: name,
            seller: seller
        })
        product.save();
    }
    res.json(productList);
})

app.get('/payments', async (req, res) => {
    const result = await History.find(
        {"userId" : req.session._id},
        {_id:0, status:1, orderName:1, approvedAt:1, paymentKey:1}
    )
    res.send(result);
})

app.listen(port, () => console.log("Server Connected.."));