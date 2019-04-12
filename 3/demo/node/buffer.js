// buffer一个node提供的用于存放二进制数据的缓存区
// const buf = Buffer.from('runoob', 'ascii');
// console.log(buf.toString('hex'));
// console.log(buf.toString('base64'));
const buf = Buffer.alloc(10, 1);
const buf1 = Buffer.from([1, 2, 3]);
const buf2 = Buffer.from('test');

const buffer = Buffer.alloc(10);
const len = buffer.write('www.baidu.com');
// const result = buffer.toString();
const result = buffer.toString('ascii', 1, 5);
console.log(result);

// 缓冲区合并
var buffer1 = Buffer.from('菜鸟教程');
var buffer2 = Buffer.from('www.runoob.com');
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('buffer3内容：' + buffer3.toString());


// 缓存区比较
var buffer4 = Buffer.from('ABC');
var buffer5 = Buffer.from('ABCD');
var results = buffer4.compare(buffer5);
console.log(results);

// 缓存区的拷贝
var buf3 = Buffer.from('abcdefghijk');
var buf4 = Buffer.from('RUNOOB');
buf4.copy(buf3, 3);    // 将buf4插入到buf3的指定位置
console.log(buf3.toString());

// 缓冲区裁剪
var buf5 = Buffer.from('runoobrunoob');
var buf6 = buf5.slice(0, 3);
console.log('buf6 content: ' + buf6);
console.log(buf5.length);
console.log(buf6.length);