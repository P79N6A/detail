// 获取用户列表信息
var express = require('express');
var app = express();
var fs = require('fs');
app.get('/list_user', function (req, res) {
    fs.readFile(__dirname + '/' + 'user.json', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.end(data);
        }
    });
});
var server = app.listen(8009, function (req, res) {
    var host = server.address().address;
    var port = server.address().port;
    console.log('应用示例访问的是', host, port);
});

