// fs里面的删除文件
var fs = require('fs');
fs.unlink('input.text', function (err) {
    if (err) {
        console.log(err);
    }
    console.log('文件删除成功');
});