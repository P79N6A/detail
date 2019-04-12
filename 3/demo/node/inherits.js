// util工具的inherits继承功能
var util = require('util');
// Base构造函数
function Base() {
    this.name = 'base';
    this.base = 1991;
    this.sayHello = function () {
        console.log('Hello' + this.name);
    };
}
// 原型上面的方法
Base.prototype.showName = function () {
    console.log(this.name);
};

function Sub() {
    this.name = 'sub';
}
//原型继承
util.inherits(Sub, Base);

var objBase = new Base();
objBase.sayHello();
objBase.showName();
console.log(objBase);

var objSub = new Sub();
objSub.showName();
console.log(objSub.base);
console.log(objSub);

// util.inherits只继承了对象原型身上的方法，其他的并没有被继承