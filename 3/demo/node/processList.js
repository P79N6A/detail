// process的有用属性
// 输出到终端
process.stdout.write('test content');
// 通过参数读取
process.argv.forEach(function (val, index, array) {
    console.log(index + ':' + val);
});
// 获取执行路径
console.log(process.execPath);
// 获取平台信息
console.log(process.platform);