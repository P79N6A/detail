// node里面的写入文件
var fs = require('fs');
console.log('准备写入文件');
fs.writeFile('input.text', '我是通过writeFile写入的内容', function (err) {
    if (err) {
        return console.error(err);
    }
    fs.readFile('input.text', function (err, data) {
        if (err) {
            return console.error(err);
        }
        console.log('读取写入之后的文件内容' + data.toString());
    });
});
// 通过writeFile会将原先的内容直接给覆盖掉