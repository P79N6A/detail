/**
 * @file
 * @description arguments是外面传给函数的参数，并不是函数自身申明的参数
 */

function test() {
    console.log(arguments);
    console.log(arguments.callee);
    console.log(arguments.caller);
}
test();
