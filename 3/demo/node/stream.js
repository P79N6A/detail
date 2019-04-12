// 从流中读取数据,    是异步操作么？？？？？
var fs = require('fs');
var data = '';
var readerStream = fs.createReadStream('./input.text');
readerStream.setEncoding('UTF8');
readerStream.on('data', function (chunk) {
    console.log('data'+ chunk)
    data += chunk;
});
readerStream.on('end', function () {
    console.log(data);
});
readerStream.on('error', function (err) {
    console.log(err.stack);
});
console.log('程序执行完毕');