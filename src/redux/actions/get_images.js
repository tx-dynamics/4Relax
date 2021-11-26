import axios from 'axios';
import {BASE_URL} from '../base-url';
import { GET_IMAGES,UPDATE_USER } from './types';
//Local Types
export const IMAGES_FAILED = 'IMAGES_FAILED';
export const LOADING_PAYMENT = 'PAYMENT_FAILED';

export const getAllimages = () => {
  // console.log('HERE');
  // console.log(params);
  return async dispatch => {
    // dispatch(authLoading());
    try {
      const res = await axios.get(
        `${BASE_URL}api/relax/categoryImage/all`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      // return res;
      if (res?.data) {
        // console.log(res);
        return dispatch(imagesSuccess(res));
      }
      return dispatch(imagesFailed(res));
    } catch (err) {
      // console.log('---> catch', err.response);
      dispatch(imagesFailed(err.response));
    }
  };
};
//helper
export const imagesSuccess = res => ({
  type: GET_IMAGES,
  payload: res,
});


export const imagesFailed = err => ({
  type: IMAGES_FAILED,
  payload: err,
});