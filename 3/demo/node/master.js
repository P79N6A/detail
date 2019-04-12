// 子线程调用
const childProcess = require('child_process');
for (var i = 0; i < 3; i++) {
    var workProcess = childProcess.exec('node support.js', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code' + error.code);
        }
        console.log('stdout' + stdout);
        console.log('stderr' + stderr);
    });
    workProcess.on('exit', function (code) {
        console.log('子进程已退出，推出码' + code);
    });
};