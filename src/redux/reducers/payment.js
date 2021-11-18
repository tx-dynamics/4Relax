import {PAYMENT_FAILED, LOADING_PAYMENT} from '../actions/payment';
import {PAYMENT,UPDATE_USER} from '../actions/types';

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
  status: '',
};
export const PaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_PAYMENT:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
      };
      case UPDATE_USER:
        console.log('here=============>');
        return {
          ...state,
          userData: action.payload.data,
          token: action.payload.data.token,
          isLoggedIn: true,
          isLoading: false,
          isSuccess: true,
          isError: false,
          errMsg: null,
        };
    case PAYMENT_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: true,
        isSuccess: false,
        errMsg: null,
        message: 'request failed',
      };
    

    default:
      return state;
  }
};
