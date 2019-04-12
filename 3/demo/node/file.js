// node里面的读取文件
var fs = require('fs');
var buf = new Buffer(1024);
fs.open('input.text', 'r+', function (err, fd) {
    if (err) {
        return console.error(err)
    }
    fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
        if (err) {
            return console.error(err);
        }
        console.log(bytes + '字节被读取');
        // 仅输出读取的字节
        if (bytes > 0) {
            console.log(buf.slice(0, bytes).toString());
        }
    });
});