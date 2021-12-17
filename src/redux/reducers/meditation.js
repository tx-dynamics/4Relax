import {LOADING_MEDITATION, MEDITATION_FAILED} from '../actions/meditation';
import {DELETE_CHAT,CLEAR_MEDI, GET_MEDITATIONS,GET_MEDCATEGORIES,SAVE_MEDI, SET_FAV, UPLOAD_DOCS} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  meditationData: '',
  subCategories: '',
  status: '',
  msg: null,
};
export const MeditationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_MEDITATION:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isSuccess: false,
        errMsg: null,
        message: null,
      };
    case GET_MEDITATIONS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        meditationData: action.payload,

      };

      case SAVE_MEDI:
      console.log("save medi called ",action.payload)
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        meditationData: action.payload,

      };

      case GET_MEDCATEGORIES:
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
      case CLEAR_MEDI:
        console.log("clear called");
        return {
          ...state,
          isLoading: false,
          isError: true,
          isSuccess: false,
          errMsg: null,
          meditationData: '',
          subCategories: '',
        };
    case MEDITATION_FAILED:
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
