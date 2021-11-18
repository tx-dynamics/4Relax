import axios from 'axios';
import {BASE_URL} from '../base-url';
import {rootReducer} from '../reducers';
import {groupReducer} from '../reducers/group';
import {persistConfig} from '../store';
import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASS,
  CONFIRM_CODE,
  CREATE_GROUP,
  GOOGLE_LOGIN,
  UPDATE_USER,
  GOOGLE_SIGNUP,
  GOOGLE_FAIL,
  GROUP_FAIL,
} from './types';
//Local Types
export const AUTH_LOADING = 'AUTH_LOADING';
export const AUTH_FAILED = 'AUTH_FAILED';
export const INTEREST_FAILED = 'INTEREST_FAILED';
export const EMAIL_FAILED = 'EMAIL_FAILED';
export const CODE_FAILED = 'CODE_FAILED';
export const REG_FAILED = 'REG_FAILED';

export const loginUser = params => {
  // console.log('HERE');
  // console.log(params);
  return async dispatch => {
    dispatch(authLoading());
    try {
      const res = await axios.post(
        `${BASE_URL}api/relax/user/login`,
        JSON.stringify(params),
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
        return dispatch(loginSuccess(res));
      }
      return dispatch(authFailed(res));
    } catch (err) {
      // console.log('---> catch', err.response);
      dispatch(authFailed(err.response));
    }
  };
};

export const forgotpassword = params => {
  // console.log('HERE');
  // console.log(params);
  return async dispatch => {
    dispatch(authLoading());
    try {
      const res = await axios.post(
        `${BASE_URL}api/relax/user/forgotPassword`,
        JSON.stringify(params),
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
        return dispatch(forgotSuccess(res));
      }
      return dispatch(authFailed(res));
    } catch (err) {
      // console.log('---> catch', err.response);
      dispatch(authFailed(err.response));
    }
  };
};


export const googleLoginApi = params => {
  return async dispatch => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/relax/user/loginWithGoogle`,
        JSON.stringify(params),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if(res?.data){
        // console.log(res?.data);
        return dispatch(registerSuccess(res));
      }
      return dispatch(registerFAILED(err.response));
    } catch (err) {
      dispatch(registerFAILED(err.response));
    }
  };
}
export const registerUser = params => {
  return async dispatch => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/relax/user/signup`,
        JSON.stringify(params),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if(res?.data){
        // console.log(res?.data);
        return dispatch(registerSuccess(res));
      }
      return dispatch(registerFAILED(err.response));
    } catch (err) {
      dispatch(registerFAILED(err.response));
    }
  };
}

//Google
export const Googlelogin = params => {
  // console.log('HERE');
  // console.log(params);
  return async dispatch => {
    dispatch(authLoading());

    try {
      const res = await axios.post(
        `${BASE_URL}auth/google`,
        JSON.stringify(params),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      if (res?.data?.logged) {
        // console.log(res);
        return dispatch(logingoogle(res));
      }
      return dispatch(authFailed(res));
    } catch (err) {
      console.log(err.response.data);
      dispatch(authFailed(err.response));
    }
  };
};
export const logoOut = params => {
  // console.log(params);
  return async dispatch => {
    dispatch(logoutUserSuccess());
  };
};

//helper Functions

const logingoogle = res => ({
  type: GOOGLE_LOGIN,
  payload: res,
});

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

const authLoading = () => ({
  type: AUTH_LOADING,
});
const googleFailed = err => ({
  type: GOOGLE_FAIL,
  payload: err,
});
export const authFailed = err => ({
  type: AUTH_FAILED,
  payload: err,
});
export const loginSuccess = res => ({
  type: LOGIN_USER,
  payload: res,
});

export const forgotSuccess = res => ({
  type: FORGOT_PASS,
  payload: res,
});

const registerSuccess = res => ({
  type: REGISTER_USER,
  payload: res,
});
const registerFAILED = err => ({
  type: REG_FAILED,
  payload: err,
});

export const logoutUserSuccess = () => ({
  type: LOGOUT_USER,
});
