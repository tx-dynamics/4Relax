import axios from 'axios';
import {BASE_URL} from '../base-url';
import { POST_CONTACT } from './types';
//Local Types
export const REQUEST_FAILED = 'REQUEST_FAILED';
export const LOADING_REQ = 'LOADING_REQ';

export const send_contact = (params) => {
//   console.log(rid);
  return async dispatch =>  {
    // dispatch(chatLoading());
    try {
      const res = await axios.post(`${BASE_URL}api/relax/user/contactUs`,
      JSON.stringify(params),
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
  type: POST_CONTACT,
  payload: res,
});


const meditatLoading = () => ({
  type: LOADING_MEDITATE,
});

const subsFailed = res => ({
  type: LOADING_REQ,
  payload: res,
});
