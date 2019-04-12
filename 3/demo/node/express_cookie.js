// express可以利用中间插件向Node.js服务器发送cookie信息，输出了客户端发送的cookie信息
var express = require('express');
var cookieParser = require('cookie-parser');
var util = require('util');
var app = express();
app.use(cookieParser());
app.get('/', function (req, res) {
    console.log('Cookies' + util.inspect(req.cookies));
});
app.listen(8009);
