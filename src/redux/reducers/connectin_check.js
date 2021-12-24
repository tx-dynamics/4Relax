import { CONNECTION_CHECK } from '../actions/types';
const initialState = {
  connect : false
};
export const connectionReducer = (state = initialState, action) => {
  switch(action.type) {
    case CONNECTION_CHECK:
        console.log('connect',action.payload);
        return {
        ...state,
        connect:action.payload
      };
    default:
      return state;
  }
}
