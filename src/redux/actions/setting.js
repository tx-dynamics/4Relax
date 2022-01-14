import axios from 'axios';
import {BASE_URL} from '../base-url';
import {rootReducer} from '../reducers';
import {groupReducer} from '../reducers/group';
import {persistConfig} from '../store';
import {
  SETTING_CONST,
} from './types';
export const SETTING_FAILED = 'SETTING_FAILED';

export const allsettings = () => {
    // console.log(id);
    // alert('settings')
      // console.log(`${BASE_URL}api/relax/user/updateNotification/${id}`);
      return async dispatch => {
        // dispatch(chatLoading());
        try {
          const res = await axios.get(`${BASE_URL}api/relax/settings/all`
           ,{
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
          )
          // .then(response => console.log(response));
          // console.log(res);
          // if (res?.data) {
            console.log("HeERE======================>",res);
            dispatch(getsettings(res));
          // }
          // return dispatch(subsFailed(res));
          return res;
        } catch (err) {
          // console.log(err.response.data);
          dispatch(authFailed(err.response));
        }
      };
    };

    export const getsettings = res => ({
        type: SETTING_CONST,
        payload: res,
      });

      export const authFailed = err => ({
        type: SETTING_FAILED,
        payload: err,
      });