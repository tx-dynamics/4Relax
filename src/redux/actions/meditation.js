import axios from 'axios';
import {BASE_URL} from '../base-url';
import { GET_MEDITATIONS,SET_FAV, GET_MEDCATEGORIES,SAVE_MEDI,SAVE_MEDICAT,CLEAR_MEDI} from './types';
//Local Types
export const MEDITATION_FAILED = 'MEDITATE_FAILED';
export const LOADING_MEDITATION = 'LOADING_MEDITATE';

export const get_allmeditation = params => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.post(`${BASE_URL}api/relax/meditation/getAll`,
      JSON.stringify(params), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      dispatch(getmsg(res));
      // dispatch(storeMedi(res));
      return res;
    } catch (err) {
      console.log(err.response.data);
      dispatch(meditatFailed(err.response));
    }
  };
};

export const get_categories = () => {
  //   console.log(rid);
    return async dispatch => {
      // dispatch(chatLoading());
      try {
        const res = await axios.get(`${BASE_URL}api/relax/categories/getSingleTrackCategory/Meditation`,
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

  export const storeMedidation = params => {
    // console.log(params);
    return async dispatch => {
        // console.log('called',params);
      dispatch(storeMedi(params));
    };
  };

  export const clearData = () => {
    // console.log(params);
    return async dispatch => {
        // console.log('called',params);
      dispatch(clear());
    };
  };

  //helper
  const clear = () => ({
    type: CLEAR_MEDI,
  });

const getmsg = res => ({
  type: GET_MEDITATIONS,
  payload: res,
});

const storeMedi = res => ({
  type: SAVE_MEDI,
  payload: res,
});

const getcat = res => ({
  type: GET_MEDCATEGORIES,
  payload: res,
});
const getfav = res => ({
  type: SET_FAV,
  payload: res,
});

const meditatLoading = () => ({
  type: LOADING_MEDITATE,
});

const meditatFailed = res => ({
  type: MEDITATION_FAILED,
  payload: res,
});
