import {LOADING_STORIES, STORIES_FAILED} from '../actions/stories';
import {DELETE_CHAT, GET_STORIES,SET_FAV, GET_STORCATEGORIES, UPLOAD_DOCS} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  subCategories: '',
  storiesData: '',
  status: '',
  msg: null,
};
export const storyReducer = (state = initialState, action) => {
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
        storiesData: action.payload,

      };
      case GET_STORCATEGORIES:
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

    case STORIES_FAILED:
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
