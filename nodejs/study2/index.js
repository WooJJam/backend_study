const express = require('express') // express module
const app = express() // new express app
const port = 5000 // port
const bodyParser = require('body-parser');
const {User} = require("./model/User");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jaemin5548:dnwoals1011@study2.999l4bh.mongodb.net/?retryWrites=true&w=majority', ).then(() => console.log('MongoDB connect..')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World'))

app.post('/register', (req, res) => {

    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어줌.

    // {
    //     id:"hello",
    //     password:"123"
    // } -> req.body 에는 이런 내용들이 담겨있다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))