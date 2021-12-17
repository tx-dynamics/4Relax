import { VALIDATE_PLAYER } from './types';
export const togglePlayer = params => {
    // console.log(params);
    return async dispatch => {
        // console.log('called',params);
      dispatch(logoutUserSuccess(params));
    };
  };

  export const logoutUserSuccess = (res) => ({
    type: VALIDATE_PLAYER,
    payload: res,
  });
