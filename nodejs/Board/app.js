const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const connect = require('./Schema/index');
const User = require('./Schema/User');
const axios = require('axios');
const express_session = require('express-session');
const mongoose = require('mongoose');
const Post = require('./Schema/Posts');
const Counter = require('./Schema/Counter');

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
    res.redirect('/main');
})

app.get('/main', (req, res) => {
    console.log(req.session);
    // if(req.session.email) {
        res.render('main.ejs', {
            id: req.session.email
        })
    // }
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
    }
})

app.post('/register/duplicateCheck', async (req,res) =>{
    
    var email = req.body.email;
    let result = await duplicateCheck(email);
    console.log(result);
    if(result) {
        res.send("써라 병신아");
    }else {
        res.send("없아 씨발아");
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/login', async (req,res) => {
    var email = req.body.login_id;
    var password = req.body.login_pw;

    await User.findOne({email: email, password: password}).exec((err, result) => {
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

app.get('/logout', (req,res) => {
    if(req.session.email) {
        console.log("로그아웃!");
        req.session.destroy(function(err) {

            if(err) throw err;
            res.redirect('/');
        })
    }
})

app.get('/board', (req,res) => {
    res.render('board.ejs');
})

app.get('/board/register', (req,res) => {
    res.render('board_register.ejs');
})

app.post('/board/register', async(req,res) => {

    var subject = req.body.subject;
    var content = req.body.content;
    var email = req.session.email;
    let writer;

    await User.findOne({email: email},{})
    .then(result => writer = result._id);
    console.log(writer);

    data = await Counter.findOne({name:"게시물"})
    totalPost = (data.total + 1);   

    const post = await new Post({
        _id : totalPost,
        subject : subject,
        content : content,
        writer : writer
    })
    post.save();

    await Counter.updateOne({name:"게시물"}, {total: totalPost})

    res.redirect('/board/list');

})

app.get('/board/list', async(req,res) => {

    let list;
    var writer = new Array();

     await Post.find({},{id:1, subject:1, content:1, createdAt:1, writer:1})
    .then(data =>  list = data);

    // console.log(list);

    for(var i=0; i<list.length; i++) {
        var info = new Object();
        await User.find({_id:list[i].writer},{})
        .then(userInfo => {
            info.nickname = userInfo[0].nickname;
            writer.push(info);
            // console.log(info);
        });
    }

    console.log(writer);

    res.render('list.ejs', {
        list: list,
        writer: writer
    });
})

app.get('/board/:boardid/delete', async(req,res) => {
    let {boardid} = req.params;
    const userinfo = await User.findOne({email:req.session.email},{});
    const postinfo = await Post.findOne({_id:boardid});

    if(await (userinfo._id).equals(postinfo.writer)) {
        await Post.findByIdAndDelete(boardid);
        res.json({
            delete: "OK"
        })
    }else {
        res.json({
            delete: "NOK"
        })
    }
})

app.get('/board/:boardid', async (req, res)=> {
    var boardid = req.params.boardid;
    var post;

    await Post.findOne({_id:boardid},{id:1, subject:1, content:1, createdAt:1, writer:1})
    .then(data =>  post = data);

    const writer = await User.findOne({_id:post.writer},{});

    res.render('content.ejs', {
        post: post,
        writer: writer
    });
})

app.listen(port, () => console.log("server Connected..."));