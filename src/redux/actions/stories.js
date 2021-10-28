import axios from 'axios';
import {BASE_URL} from '../base-url';
import {GET_ALL_MESSAGE_GROUP, GET_STORIES, SEND_MSG, UPLOAD_DOCS} from './types';
//Local Types
export const STORIES_FAILED = 'STORIES_FAILED';
export const LOADING_STORIES = 'LOADING_STORIES';

export const get_allStories = () => {
//   console.log(rid);
  return async dispatch => {
    // dispatch(chatLoading());
    try {
      const res = await axios.get(`${BASE_URL}api/relax/stories/getAll`, {
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
  type: GET_STORIES,
  payload: res,
});

const meditatLoading = () => ({
  type: LOADING_STORIES,
});

const meditatFailed = res => ({
  type: STORIES_FAILED,
  payload: res,
});
