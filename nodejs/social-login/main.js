const express = require('express');
const axios = require('axios');
const { propfind } = require('../study1-2_Express/routes');
const app = express();
const port = 4000;

const REST_API_KEY = "6c942efa99c45588cbc84327554939d5";
const REDIRECT_URI = "http://localhost:4000/auth/kakao/callback";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

app.get('/', (req, res) => {
    res.status(200).send(`<a href = ${KAKAO_AUTH_URL}>카카오 로그인</a>`);
})

app.get('/auth/kakao/callback', async (req, res) => {
    const code = req.query.code;
    const token = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        params:{
            grant_type: 'authorization_code',
            client_id: REST_API_KEY,
            code,
            redirect_uri : "http://localhost:4000/auth/kakao/callback"
        }
    })

    const userInfo = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded;charset",
            'Authorization': 'Bearer ' + token.data.access_token
        }
    });
    res.status(200).send("로그인 성공!");
})

app.listen(port, () => console.log(`Example app listening on port ${port}`));