// 进程,process是一个全局变量，是global全局对象的属性    异步操作
console.info('程序开始执行');
process.on('exit', function (code) {
    setTimeout(function () {
        console.log('该代码不会执行');
    }, 0);
    console.log('退出码为' + code);
});
console.log('程序执行结束');