const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

const REST_API_KEY = "6c942efa99c45588cbc84327554939d5";
const REDIRECT_URI = "http://localhost:4000/auth/kakao/callback";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('kakao_login.ejs');
})

app.get('/oauth', async (req,res)=> {
    const code = req.query.code;    
    const { data } = await axios.post(
        'https://www.googleapis.com/oauth2/v4/token',
        {
            code: code,
            client_id: "",
            client_secret: "",
            grant_type: 'authorization_code',
          redirect_uri : ''
        }
      )
    const userInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${data.access_token}`, {
        headers:{
            authorization: `Bearer ${data.access_token}`
        },
    })
    console.log(userInfo);
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