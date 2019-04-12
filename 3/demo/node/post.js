//post方式获取请求参数
var http = require('http');
var querystring = require('querystring');
var postHTML = '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>'
                + '<body>'
                + '<form method="post">'
                + '网站名： <input name="name"><br>'
                + '网站 URL： <input name="url"><br>'
                + '<input type="submit">'
                + '</form>'
                + '</body></html>';
http.createServer(function (req, res) {
    var body = '';
    // 解析请求体
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        // 解析参数
        body = querystring.parse(body);
        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-type': 'text/html;charset=utf8'});
        if (body.name && body.url) { // 输出提交的数据
            res.write('网站名' + body.name);
            res.write('<br>');
            res.write('网址' + body.url);
        } else {
            res.write(postHTML);   // 否则就直接输出空的表单
        }
        res.end();
    });
}).listen(8009);

