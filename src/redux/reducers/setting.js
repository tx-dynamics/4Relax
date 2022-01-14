import { SETTING_CONST } from '../actions/types';

import {
  SETTING_FAILED
} from '../actions/setting';

const initialState = {
  settobj : null,
  errmsg:''
};
export const settingReducer = (state = initialState, action) => {
  switch(action.type) {
    case SETTING_CONST:
        // console.log('val',action.payload);
        return {
        ...state,
        errmsg:'',
        settobj:action.payload.data[0]
      };
    case SETTING_FAILED:
      return{
        ...state,
        errmsg:"Request failed something went wrong!"
      }
    default:
      return state;
  }
}
