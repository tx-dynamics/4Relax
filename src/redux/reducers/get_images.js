import {IMAGES_FAILED} from '../actions/get_images';
import {GET_IMAGES} from '../actions/types';

const initialState = {
  userId: '',
  message: '',
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMsg: null,
  meditationData: null,
  status: '',
  msg: null,
};
export const FavoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case GET_IMAGES:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        errMsg: null,
        message: '',
        msg: action.payload,

      };

      

    case IMAGES_FAILED:
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
