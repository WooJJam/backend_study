const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const connect = require('./Schema/index');
const User = require('./Schema/User');
const axios = require('axios');
const express_session = require('express-session');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

connect();

app.use(express_session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    store:require('mongoose-session')(mongoose),
}));

app.set('view engine', 'ejs');
app.set('views', './views');

async function duplicateCheck(email) {
    return await User.exists({email: email})
}

app.get('/', (req,res) => {
    res.render('main.ejs', {
        id: req.session.email
    });
})

app.get('/register', async(req,res) => {
    res.render('register.ejs');
})

app.post('/register', async(req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.check_password;
    var name = req.body.name;
    var phone = req.body.phone_number;
    var nickname = req.body.nickname;

    console.log(email);
    console.log(password);
    console.log(password2);
    console.log(name);
    console.log(phone);
    console.log(nickname);
    let error = false;
    let message = "1234";

    if(password === password2) {
        const user = await new User({
            email : email,
            password : password,
            name : name,
            phone: phone,
            nickname: nickname
        })
        user.save();
        console.log("회원가입 완료");
    }else {
        error = true;
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/login', (req,res) => {
    var email = req.body.login_id;
    var password = req.body.login_pw;


    User.findOne({email: email, password: password}).exec((err, result) => {
        console.log(result._id);
        if(result != null) {
            req.session.id = result._id;
            req.session.email = result.email;
            console.log("로그인 성공!");
            res.redirect('/');
        } else {
            console.log("존재하지 않는 회원정보 입니다.");
        }
    })
})

app.post('/register/duplicateCheck', async (req,res) =>{
    
    var email = req.body.email;
    let result = duplicateCheck(email);
    if(result) {
        res.send("이미 존재하는 이메일입니다.");
    }else {
        res.send("없아 씨발아");
    }
})

app.listen(port, () => console.log("server Connected..."));