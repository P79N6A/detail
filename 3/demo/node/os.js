// 工具模块儿的操作系统部分
var os = require('os');
// 操作系统名
console.log('type: ' + os.type());
console.log('platform:' + os.platform());
console.log('total memory:' + os.totalmem() + 'bytes');