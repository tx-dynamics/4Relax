import axios from 'axios';
import {BASE_URL} from '../base-url';
import {GET_ALL_MESSAGE_GROUP, GET_MUSIC, SEND_MSG, UPLOAD_DOCS} from './types';
//Local Types
export const MUSIC_FAILED = 'MUSIC_FAILED';
export const LOADING_MUSIC = 'LOADING_MUSIC';

export const get_allMusic = () => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.get(`${BASE_URL}api/relax/sounds/getAll`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      dispatch(getmsg(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      dispatch(chatFailed(err.response));
    }
  };
};


//helper

const getmsg = res => ({
  type: GET_MUSIC,
  payload: res,
});

const musicLoading = () => ({
  type:  LOADING_MUSIC,
});

const musicFailed = res => ({
  type: MUSIC_FAILED,
  payload: res,
});
