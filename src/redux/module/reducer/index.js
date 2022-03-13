import { combineReducers } from 'redux';

import UserReducer from './UserReducers';

const rootReducer = combineReducers({
  User: UserReducer,
});
export default rootReducer;