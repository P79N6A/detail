/**
 * @file redux store
 * @author xueliqiang@baidu.com
 */
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducer';

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
    }
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducer', () => {
            store.replaceReducer(module.default);
        });
    }
    return {
        ...store,
        runSaga: sagaMiddleware.run
    };
}
