// express里面的post请求方式
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// 创建application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.post('/process_post', urlencodedParser, function (req, res) {
    var response = {
        'first_name': req.body.first_name,
        'last_name': req.body.last_name
    };
    res.end(JSON.stringify(response));
});
var server = app.listen(8009, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('应用实例访问地址为http://%s:%s', host, port);
});