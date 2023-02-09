const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const connect = require('./Schema/index');
const User = require('./Schema/User');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

connect();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req,res) => {
    res.render('main.ejs');
})

app.get('/register',(req,res) => {
    res.render('register.ejs');
})

app.post('/register', async(req, res) => {
    var email = req.body.email;
    var password = req.body.passowrd;

    const user = await new User({
        email : email,
        password : password
    })

    user.save();
})

app.get('/axios', (req,res) =>{
    res.send("테스트용이다 이 씨발롬아");
})

app.listen(port, () => console.log("server Connected..."));