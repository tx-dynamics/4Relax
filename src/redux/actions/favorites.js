import axios from 'axios';
import {BASE_URL} from '../base-url';
import {GET_ALL_MESSAGE_GROUP, GET_FAVORITES,SET_FAV, SEND_MSG, UPLOAD_DOCS} from './types';
//Local Types
export const FAVORITES_FAILED = 'FAVORITES_FAILED';
export const LOADING_FAVORITES = 'LOADING_FAVORITES';

export const get_allFAVORITES = () => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.get(`${BASE_URL}api/relax/favorites/getAll`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      dispatch(getmsg(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      dispatch(meditatFailed(err.response));
    }
  };
};

export const set_fav = params => {
  //   console.log(rid);
    return async dispatch => {
      // dispatch(chatLoading());
      try {
        const res = await axios.post(`${BASE_URL}api/relax/favorites/addToFavorite`,
        JSON.stringify(params),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        // return console.log(res)
        dispatch(getfav(res));
        return res;
      } catch (err) {
        console.log(err.response.data);
        dispatch(meditatFailed(err.response));
      }
    };
  };

//helper

const getmsg = res => ({
  type: GET_FAVORITES,
  payload: res,
});

const getfav = res => ({
  type: SET_FAV,
  payload: res,
});

const meditatLoading = () => ({
  type: LOADING_FAVORITES,
});

const meditatFailed = res => ({
  type: FAVORITES_FAILED,
  payload: res,
});
