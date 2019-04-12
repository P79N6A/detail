// 打开文件
var fs = require('fs');
console.info('打开文件开始');
fs.open('input.text', 'r+', function (err, fd) {
    if (err) {
        return console.error(err);
    }
    // 打开文件返回的描述符
    console.log(fd);
});