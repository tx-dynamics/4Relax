import {
  AUTH_LOADING,
  AUTH_FAILED,
  INTEREST_FAILED,
  EMAIL_FAILED,
  CODE_FAILED,
  REG_FAILED,
} from '../actions/auth';
import {
  REGISTER_USER,
  LOGIN_USER,
  LOGOUT_USER,
  GET_INTEREST,
  CONFIRM_EMAIL,
  CONFIRM_CODE,
  CREATE_GROUP,
  GOOGLE_LOGIN,
  GOOGLE_SIGNUP,
  GOOGLE_FAIL,
  GROUP_FAIL,
} from '../actions/types';

const initialState = {
  isLoggedIn: false,
  token: '',
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  userData: null,
  joinGroupData: null,
  status: '',
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
      };
    case AUTH_FAILED:
      // console.log('auth', action.payload.data.message);
      return {
        ...state,
        isLoading: false,
        isError: true,
        isSuccess: false,
        errMsg: action.payload,
        isLoggedIn: false,
        message: action.payload.data.message,
      };
    case LOGIN_USER:
      console.log('here');
      return {
        ...state,
        userData: action.payload.data.user,
        token: action.payload.data.token,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
        isError: false,
        errMsg: null,
      };
    case GOOGLE_LOGIN:
      console.log('auth', action.payload.data.message);
      return {
        ...state,
        message: action.payload.data.message,
        token: action.payload.data.token,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
        isError: false,
        userData: action.payload.data.user,
        // errMsg: null,
      };
    case REGISTER_USER:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: action.payload.data.message,
        errMsg: null,
      };
    case REG_FAILED:
      return {
        ...state,
        message: action.payload.data.message,
        isSuccess: false,
        isError: false,
        errMsg: null,
        isLoggedIn: false,
      };
    case LOGOUT_USER:
      return {
        ...state,
        userId: '',
        token: '',
        isLoggedIn: false,
        isLoading: false,
        isSuccess: true,
        isError: false,
        errMsg: null,
      };

    case CONFIRM_EMAIL:
      return {
        ...state,
        message: action.payload.data.message,
        isSuccess: true,
        isError: false,
        errMsg: null,
      };

    case EMAIL_FAILED:
      return {
        ...state,
        message: action.payload.data.message,
        isSuccess: false,
        isError: false,
        errMsg: null,
      };
    case CONFIRM_CODE:
      return {
        ...state,
        message: action.payload.data.message,
        isError: false,
        errMsg: null,
        isLoading: false,
        isSuccess: true,
        joinGroupData: action.payload.data,
      };
    case CODE_FAILED:
      return {
        ...state,
        message: action.payload.data.message,
        isSuccess: false,
      };

    default:
      return state;
  }
};
