// EventEmitter类
var events = require('events');
var eventEmitter = new events.EventEmitter();
// 监听器1
function listener1() {
    console.log('监听器1执行');
}
// 监听器2
function listener2() {
    console.log('监听器2执行');
}
// 绑定监听事件1
eventEmitter.addListener('connection', listener1);
// 绑定监听事件2
eventEmitter.on('connection', listener2);
// 监听绑定回调事件的个数
var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + '个监听器监听连接事件');
// 触发事件connection
eventEmitter.emit('connection');
// 移除绑定的listener1函数
eventEmitter.removeListener('connection', listener1);
console.log('listener1不再受监听')
// 触发连接事件
eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'connection');
console.log(eventListeners + '个监听器监听连接事件');

console.log('程序执行完毕')

eventEmitter.emit('error');