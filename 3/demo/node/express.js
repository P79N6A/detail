// node的express模块儿,完善了http功能，添加了路由跳转功能,通过向模板传递参数，动态渲染html页面
var express = require('express');
var app = express();
app.get('/index.html', function (req, res) {
    console.log(__dirname);
    console.log(__filename);
    res.sendFile(__dirname + '/' + 'index.html');
});
app.post('/process_get', function (req, res) {
    var response = {
        'first_name': req.query.first_name,
        'last_name': req.query.last_name
    };
    console.log(JSON.stringify(response));
    res.end(JSON.stringify(response));
});
app.use(express.static('public'));
// express.static() 设置静态文件路径
var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('应用实例，访问地址为 http://%s:%s', host, port);
});