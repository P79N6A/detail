// 管道流，将一个流中的数据读取到另外一个流中的
const fs = require('fs');
var rederStream = fs.createReadStream('input.text');
var writeStream = fs.createWriteStream('output.text');
rederStream.pipe(writeStream);
console.log('程序执行完毕');
