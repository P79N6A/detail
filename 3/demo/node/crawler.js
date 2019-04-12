var url = 'https://www.imooc.com/video/7965';
var http = require('http');
http.get(url,function(res) {
	var html = '';
	res.on('data',function(data) {
		html += data
	})
	res.on('end',function() {
		console.log(html)
	})
}).on('error',function() {
	console.log('获取服务器数据失败')
})