import reducers from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';

export default function initStore() {
    const store = createStore(
        reducers,
    );
    return store;
}