import axios from 'axios';
import {BASE_URL} from '../base-url';
import {GET_CATEGORIES, GET_STORIES,SET_FAV, SEND_MSG, UPLOAD_DOCS} from './types';
//Local Types
export const STORIES_FAILED = 'STORIES_FAILED';
export const LOADING_STORIES = 'LOADING_STORIES';

export const get_allStories = params => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.post(`${BASE_URL}api/relax/stories/getAll`,
      JSON.stringify(params), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      dispatch(getmsg(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      // dispatch(chatFailed(err.response));
    }
  };
};

export const get_categories = () => {
  //   console.log(rid);
    return async dispatch => {
      // dispatch(chatLoading());
      try {
        const res = await axios.get(`${BASE_URL}api/relax/categories/getSingleTrackCategory/Stories`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        // console.log("+++++++++++++++++++++++++++++++")
        // console.log(res?.data)
        dispatch(getcat(res));
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
  type: GET_STORIES,
  payload: res,
});
const getcat = res => ({
  type: GET_CATEGORIES,
  payload: res,
});
const getfav = res => ({
  type: SET_FAV,
  payload: res,
});

const meditatLoading = () => ({
  type: LOADING_STORIES,
});

const meditatFailed = res => ({
  type: STORIES_FAILED,
  payload: res,
});
