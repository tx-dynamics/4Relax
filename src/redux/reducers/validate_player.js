import { VALIDATE_PLAYER } from '../actions/types';
const initialState = {
  val : false
};
export const validateReducer = (state = initialState, action) => {
  switch(action.type) {
    case VALIDATE_PLAYER:
        // console.log('val',action.payload);
        return {
        ...state,
        val:action.payload
      };
    default:
      return state;
  }
}
