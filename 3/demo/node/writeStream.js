// 写入流
const fs = require('fs');
var data = '用来测试的数据';
// 创建一个可以写入的流，写入到文件output.text里面
var writeStream = fs.createWriteStream('output.text');
// 使用utf8编码写入数据
writeStream.write(data, 'UTF8');
// 标记文件结尾
writeStream.end();
// 处理流事件
writeStream.on('finish', function () {
    console.log('写入完成');
});
writeStream.on('error', function (err) {
    console.log(err.stack);
});
console.log('程序执行完毕');

