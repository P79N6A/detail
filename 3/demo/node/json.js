// buffer与json对象之间的相互转化
const buf = Buffer.from([01, 02, 03, 04, 05]);
// 将buffer数据类型转化为json
const json = JSON.stringify(buf);

const copy = JSON.parse(json, (key,value) => {
    return value && value.type === 'Buffer' ?
        Buffer.from(value.data) : value
})
console.log(copy)
console.log(json)