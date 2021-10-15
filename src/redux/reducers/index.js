import {combineReducers} from 'redux';

//Import All Reducers
import {authReducer} from './auth';

export default combineReducers({
  auth: authReducer,
 
});
