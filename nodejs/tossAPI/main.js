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
var express_session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', './views');

connect();

app.use(express_session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store:require('mongoose-session')(mongoose),
}))

// app.get('/', (req,res) => {
//     res.render('succes.ejs');
// })

app.get('/success', async (req,res) => {

    var orderid = req.query.orderId;
    var paymentkey = req.query.paymentKey;
    let amount = parseInt(req.query.amount);

    console.log(orderid);
    console.log(paymentkey);
    console.log(amount);

    const result = await axios.post('https://api.tosspayments.com/v1/payments/confirm', null, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Basic dGVzdF9za19CRTkyTEFhNVBWYjFrNk83cDRXMzdZbXBYeUpqOg=='
    },
    params:{
        "paymentKey": 'xMBvpmjnoD4yKeq5bgrp59DJ1gkjZX8GX0lzW6YOQJ1w9NLR',
        "orderId":'AD8aZDpbzXs4EQa-UkIX6',
        "amount": 18667
    }
    })
    console.log(result);
    res.render('succes.ejs');
})

app.get('/failed', (req,res) => {
    res.render("<h1>실패ㅠ<h1>");
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

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email, password: password}).exec((err, result) => {
        if(result != null) {
            req.session.email = email;
            res.send(email+"님 로그인!");
        }else {
            res.send("존재하지 않는 회원정보 입니다.");
        }
    })
})

getRandomUser = async function () {
    const count = await Product.countDocuments();
    const random = Math.floor(Math.random() * count);
    return Product.findOne().skip(random)
}

app.get('/toss', async (req, res) => {
    await getRandomUser()
    .then(user => {
        product = user
    })
    .catch(err => console.log(err));

    res.render('index', {
        price: product.price,
        name: product.name,
        seller: product.seller
    })
})

// app.get('/payment', (req,res) => {
//     res.render('tosspayments.ejs');
// })

// app.get('/payment', (req, res) => {

//     loadPaymentWidget(clientKey, customerKey).then(paymentWidget => {
//         paymentWidget.renderPaymentMethods('#payment-method', 15000);
//         paymentWidget.requestPayment({
//             orderId: 'AD8aZDpbzXs4EQa-UkIX6',
//             orderName: '토스 티셔츠 외 2건',
//             successUrl: 'http://localhost:4000',
//             failUrl: 'http://localhost:8080/failed',customerEmail: 'jaemin5548@naver.com', customerName: '우재민'
//         })
//     })
// })

app.post('/testingProduct', (req, res) => {
    const seed = req.body.seed;
    var productList = new Array();

    faker.mersenne.rand(seed);

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

app.listen(port, () => console.log("Server Connected.."));