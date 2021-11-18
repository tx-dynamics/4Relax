import axios from 'axios';
import {BASE_URL} from '../base-url';
import { PAYMENT,UPDATE_USER } from './types';
//Local Types
export const PAYMENT_FAILED = 'PAYMENT_FAILED';
export const LOADING_PAYMENT = 'PAYMENT_FAILED';

export const get_paymentResponse = (params) => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.post(`${BASE_URL}api/relax/user/payment`,
      JSON.stringify(params), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // if (res?.data) {
        // console.log("HeERE======================>",res?.data?.updatedUser);
        dispatch(paymentSuccess(res));
      // }
      // return dispatch(subsFailed(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      dispatch(subsFailed(err.response));
    }
  };
};
//helper
export const paymentSuccess = res => ({
  type: UPDATE_USER,
  payload: res,
});
const getmsg = res => ({
  type: PAYMENT,
  payload: res,
});


const meditatLoading = () => ({
  type: LOADING_PAYMENT,
});

const subsFailed = res => ({
  type: PAYMENT_FAILED,
  payload: res,
});
