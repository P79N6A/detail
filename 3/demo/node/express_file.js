// express的文件上传
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
// 使用静态文件
app.use(express.static('public'));
// post请求的转换
app.use(bodyParser.urlencoded({extended: false}));
// form表单？？？
app.use(multer({dest: '/tmp/'}).array('image'));
// 路由
app.get('/form.html', function (req, res) {
    res.sendFile(__dirname + '/form.html');
});
app.post('/file_upload', function (req, res) {
    console.log(req.files[0]);  // 上传的文件信息
    var desFile = __dirname + '/' + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        // 将上传的图片添加到文件夹下面
        fs.writeFile(desFile, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                var response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                };
                console.log(response);
            }
            res.end(JSON.stringify(response));
        });
    });
});
var server = app.listen(8009, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('应用示例访问的', host, port);
});