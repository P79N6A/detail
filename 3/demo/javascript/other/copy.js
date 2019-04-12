/**
 * @description 对象的深拷贝和浅拷贝
 */

const obj = {
    a: 'hello',
    b: {
        a: 'hello',
        b: 'world'
    },
    c: ['good', 'good', 'study'],
    d: function () {
        console.log('hello world');
    }
};

/**
 * @description 对象浅拷贝方法二
 * @argument 当value为{}时，改变copy之后的值，原先引用的值仍然也会发生变化
 */

function simpleCopy(obj) {
    let newObj = {};
    if (obj) {
        for (let i in obj) {
            newObj[i] = obj[i];
        }
        return newObj;
    }
}
const newObj = simpleCopy(obj);
// console.log(newObj);
// 改变copy对象之后的值，原先的引用对象是否会发生变化
newObj.a = 'after';
newObj.b.a = 'after';
newObj.c = ['after'];
newObj.d = function () {
    console.log('after');
};
console.log(obj);


/**
 * @description 对象浅拷贝方法二
 * @argument 当value为{}时，改变copy之后的值，原先引用的值仍然也会发生变化
 */

const copyObj = Object.assign({}, obj);
// copyObj.b.a = 'assign';


/**
 * @description  对象深度拷贝方法一
 * @argument  当value为Function的时候无法解析
 */

function deepCopy(obj) {
    let newObj = {};
    if (obj) {
        newObj = JSON.parse(JSON.stringify(obj));
    }
    return newObj;
}
const deepCopyObj = deepCopy(obj);
deepCopyObj.b.a = 'deepCopy';
// console.log(obj);
// console.log(deepCopyObj);

/**
 * @description 对象深度拷贝方法二------递归
 * @argument 比较理想的解决方案
 */

function deepClone(initalObj, finalObj) {
    var obj = finalObj || {};
    for (var i in initalObj) {
        if (initalObj[i] === obj) { // 避免相互引用出现的死循环
            continue;
        }
        if (typeof initalObj[i] === 'object') {
            obj[i] = (initalObj[i].constructor === Array) ? [] : {};
            arguments.callee(initalObj[i], obj[i]);
        } else {
            obj[i] = initalObj[i];
        }
    }
    return obj;
}
const deepObj = deepClone(obj);
deepObj.b.a = 'deep';
// console.log(obj);
// console.log(deepObj);

/**
 * @description 对象深度拷贝方法三
 * @argument  直接运用Object.create()无法实现拷贝,存在弊端
 */

function deepCopyFun(initalObj, finalObj) {
    var obj = finalObj || {};
    for (var i in initalObj) {
        var prop = initalObj[i];
        if (prop === obj) {
            continue;
        }
        if (typeof prop === 'object') {
            obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
        } else {
            obj[i] = prop;
        }
    }
    return obj;
}
const newobj = deepCopyFun(obj);
// console.log(obj);
// console.log(newobj);
