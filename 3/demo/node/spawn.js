// 子进程里面的spawn
const childProcess = require('child_process');
for (var i = 0; i < 3; i++) {
    var workProcess = childProcess.spawn('node', ['support.js', i]);
    workProcess.stdout.on('data', function (data) {
        console.log('stdout:' + data);
    });
    workProcess.stderr.on('data', function (data) {
        console.log('stderr' + data);
    });
    workProcess.on('close', function (code) {
        console.log('子进程已退出，推出码: ' + code)
    });
}
