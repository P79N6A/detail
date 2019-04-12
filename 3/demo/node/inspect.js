// util.inspect是一个将任意对象转化为字符串的方法
var util = require('util');
function Person() {
    this.name = 'byvoid';
    this.toString = function () {
        return this.name;
    };
}
var obj = new Person();
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));