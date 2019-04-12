// 创建目录
var fs = require('fs');
fs.mkdir('/tmp/test', function (err) {
    if (err) {
        console.log(err)
    }
    console.log('创建目录成功');
    // 目录读取
    fs.readdir('/tmp', function (err, files) {
        if (err) {
            console.log(err);
        }
        files.forEach(function (file) {
            console.log(file);
        });
    });
    // 删除目录
    fs.rmdir('/tmp/test', function (err) {
        if (err) {
            console.log(err);
        }
        console.log('删除目录成功');
    });
});