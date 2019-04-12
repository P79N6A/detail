// 非阻塞的方式读取文件
var fs = require('fs');
fs.readFile('input.text', function (err, data) {
    if (err) {
        return console.error(err)
    }
    console.log(data.toString());
});
console.log('此程序运行结束');

// 一般异步和非阻塞同时进行,node.js通过异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高，nodejs使用事件驱动