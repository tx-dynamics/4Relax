import axios from 'axios';
import {BASE_URL} from '../base-url';
import { GET_SUBSCRIPTION } from './types';
//Local Types
export const SUBS_FAILED = 'SUBS_FAILED';
export const LOADING_SUBS = 'LOADING_SUBS';

export const get_subscription = () => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.get(`${BASE_URL}api/relax/subscription/all`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      dispatch(getmsg(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      dispatch(subsFailed(err.response));
    }
  };
};




//helper

const getmsg = res => ({
  type: GET_SUBSCRIPTION,
  payload: res,
});


const meditatLoading = () => ({
  type: LOADING_MEDITATE,
});

const subsFailed = res => ({
  type: SUBS_FAILED,
  payload: res,
});
