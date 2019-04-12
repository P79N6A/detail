// 服务器端
var http = require('http');
var url = require('url');
function start(route) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log('Request for' + pathname + 'receive');
        route(pathname);
        response.writeHead('200', {"Content-type": "text/plain"});
        response.write('Hello World');
        response.end();
    }
    http.createServer(onRequest).listen(8009);
    console.log('server is started');
}
exports.start = start;
