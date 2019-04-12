/**
 * @file 关于数据的方法
 */

let arr1 = [
    {code: '0000', name: 'Jim'},
    {code: '0002', name: 'Sam'},
    {code: '0004', name: 'Rose'}
];
let arr2 = [
    {code: '0000', name: 'Jim'},
    {code: '0001', name: 'Jake'},
    {code: '0002', name: 'Sam'},
    {code: '0003', name: 'Sweet'},
    {code: '0004', name: 'Rose'}
];

// 方法一
function traditional(arr1, arr2) {
    if (arr1 && arr2) {
        arr2.forEach((arr2Item, arr2index) => {
            arr1.forEach((arr1Item, arr1index) => {
                if (arr2Item.code === arr1Item.code) {
                    arr2.splice(arr2index, 1, null);
                }
            });
        });
    }
    return arr2.filter(item => item !== null);
}
const result = traditional(arr1, arr2);
console.log(result);
