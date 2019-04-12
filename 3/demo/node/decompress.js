// 运用管道流来解压文件
const fs = require('fs');
const zlib = require('zlib');
fs.createReadStream('input.text.gz').pipe(zlib.createGunzip()).pipe(fs.createWriteStream('input.txt'));
console.log('文件解压完成')