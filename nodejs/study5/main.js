const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 4000;

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(express.static(path.join(__dirname, 'public'))); 
// express.static를 통해서 정적파일을 nodejs가 포워딩하게 해준다는데 아직 잘 모르겠음

app.use(bodyParser.urlencoded(false));
app.use('/admin', adminRouter);
app.use(shopRouter);


app.use((req,res, next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})



app.listen(port, () => console.log(`Example app listening on port ${port}`));

