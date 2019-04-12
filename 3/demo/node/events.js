//
var EventEmitter = require('events').EventEmitter;
var life = new EventEmitter();
life.setMaxListeners(11);
// 绑定事件
function water (who) {
    console.log( `给${who}倒水`)
    
}
life.addListener('求安慰', water)
life.on('求安慰', function (who) {
    console.log( `给${who}做饭`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}洗衣服`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。4`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。5`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。6`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。7`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。8`)
})
life.on('求安慰', function (who) {
    console.log( `给${who}。。9`)
})
life.on('求溺爱', function (who) {
    console.log( `给${who}。10`)
})
life.on('求溺爱',function(who) {
    console.log('你想累死'+who)
})
// 移除事件,后面的回调函数必须是实名函数,匿名函数不可以移除
life.removeListener('求安慰',water)
life.removeAllListeners('求安慰')

life.emit('求安慰','汉子')
life.emit('求溺爱','妹纸')

// 判断一个事件身上监听了多少函数
console.log(life.listeners('求安慰').length)
console.log(life.listeners('求溺爱').length)

// 返回布尔值，判断事件是否被监听
// var hasConfirm = life.emit('求安慰','汉子');
// var hasLoved = life.emit('求溺爱','妹纸');
// var hasTest = life.emit('求玩耍','汉子和妹纸');
// console.log(hasConfirm,hasLoved,hasTest)

