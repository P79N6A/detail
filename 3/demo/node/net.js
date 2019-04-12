// node的net模块儿创建TCP服务器
var net = require('net');
var server = net.createServer(function (connection) {
    connection.on('end', function () {
        console.log('客户端关闭连接');
    });
    connection.write('Hello World!\r\d');
    connection.pipe(connection);
}).listen(8009, function () {
    console.log('server is listening');
});
