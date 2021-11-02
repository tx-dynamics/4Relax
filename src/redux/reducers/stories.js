import {LOADING_MEDITATION, MEDITATION_FAILED} from '../actions/meditation';
import {DELETE_CHAT, GET_STORIES,SET_FAV, SEND_MSG, UPLOAD_DOCS} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  storiesData: null,
  status: '',
  msg: null,
};
export const ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_STORIES:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
        message: null,
      };
    case GET_STORIES:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        msg: action.payload,

      };

      case SET_FAV:
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