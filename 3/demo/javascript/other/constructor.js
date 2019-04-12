/**
 * @file constructor 构造函数
 */

function Father(name, age) {
    this.name = name;
    this.age = age;
}
Father.prototype.test = function () {
    console.log(this.age);
}

const father = new Father();
console.log(father.constructor);




function Son(type) {
    this.type = type;
}
Son.prototype = new Father();

const son = new Son();
console.log(son.constructor);
