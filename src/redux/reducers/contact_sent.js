import {REQUEST_FAILED, LOADING_REQ} from '../actions/contact_sent';
import {POST_CONTACT} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  subsData: null,
  status: '',
  msg: null,
};
export const SubscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_REQ:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
        message: null,
      };
    case POST_CONTACT:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        msg: action.payload,

      };

     

    case REQUEST_FAILED:
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
