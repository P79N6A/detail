//打开，截取，读取，关闭文件
var fs = require('fs');
var buf = new Buffer(1024);
// 第一步打开文件
fs.open('input.text', 'r+', function (err, fd) {
    if (err) {
        return console.error(err);
    }
    // 第二步截取文件
    fs.ftruncate(fd, 10, function (err) {
        if (err) {
            console.log(err);
        }
        // 第三步读取文件
        console.log(buf.toString());
        fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
            if (err) {
                console.log(err);
            }
            if (bytes > 0) {
                console.log(bytes);
                console.log(buf.slice(0, bytes).toString());
            }
            // 最后一步关闭文件
            fs.close(fd, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('文件关闭');
            });
        });
    });
});