import {combineReducers} from 'redux';

//Import All Reducers
import {authReducer} from './auth';
import {validateReducer} from './validate_player';
import {connectionReducer} from './connectin_check';
import {MeditationReducer} from './meditation';
import {storyReducer} from './stories';
import {soundReducer} from './music';
import {settingReducer} from './setting';

export default combineReducers({
  auth: authReducer,
  validatePlayer:validateReducer,
  connectionCheck:connectionReducer,
  meditations:MeditationReducer,
  story:storyReducer,
  sound:soundReducer,
  setting:settingReducer
});
