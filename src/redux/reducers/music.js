import {LOADING_MUSIC, MUSIC_FAILED} from '../actions/music';
import {DELETE_CHAT, GET_MUSIC,SET_FAV, GET_SOUNCATEGORIES, UPLOAD_DOCS} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  soundData: '',
  subCategories: '',
  status: '',
  msg: null,
};
export const soundReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_MUSIC:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
        message: null,
      };
    case GET_MUSIC:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        soundData: action.payload,

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

      case GET_SOUNCATEGORIES:
        // console.log("get cater here ======> ",action.payload);
        return {
          ...state,
          isLoading: false,
          isError: false,
          isSuccess: true,
          errMsg: null,
          message: '',
          subCategories: action.payload,
  
        };

    case MUSIC_FAILED:
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
