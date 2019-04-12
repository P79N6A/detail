// 流读取数据更过的是复制内容，如何更好的在文件后面追加内容
const fs = require('fs');
var read = fs.createReadStream('input.text');
var write = fs.createWriteStream('output.txt', {'flags': 'a'});
read.pipe(write);
console.log('执行完毕')