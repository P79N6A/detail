// 用链式流来压缩文件
const fs = require('fs');
const zlib = require('zlib');
fs.createReadStream('input.text').pipe(zlib.createGzip()).pipe(fs.createWriteStream('input.text.gz'));
console.log('文件压缩完毕');