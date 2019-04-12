/**
 * @file saga
 * @author xueliqiang@baidu.com
 */
import {effects} from 'redux-saga';
const {fork, put, call, take, all, select, takeEvery} = effects;

export default function* root() {
    yield all([
    ]);
}
