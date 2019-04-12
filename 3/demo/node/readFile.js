// node文件系统里面的读取文件
var fs = require('fs');
// 异步读取文件
fs.readFile('input.text', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log('异步读取' + data.toString());
});
// 同步获取文件
var data = fs.readFileSync('input.text');
console.log(data.toString());