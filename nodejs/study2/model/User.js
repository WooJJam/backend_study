const mongose = require('mongoose');
const userSchema = mongose.Schema({
    /*
    이름 : 10자이내
    이메일: trim을 이용하여 띄어쓰기방지, 중복방지
    비밀번호: 5자이상
    lastnmae
    역할: 일반(0) vs 관리자(1), default: 0 
    이미지: 문자열
    token, toenExp(토큰 유지시간)
    */
    name: {
        type: String,
        maxlength: 10
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default:0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongose.model('User', userSchema)

module.exports = { User }