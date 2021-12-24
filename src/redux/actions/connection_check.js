import { CONNECTION_CHECK } from './types';
import NetInfo from "@react-native-community/netinfo";

export const connectivityCheck = () => {
    // console.log(params);
    return async dispatch => {
        // console.log('called',params);
        NetInfo.fetch().then((state) => {
            console.log(state.isConnected)
            dispatch(logoutUserSuccess(state.isConnected));           
          });
    };
  };

  export const logoutUserSuccess = (res) => ({
    type: CONNECTION_CHECK,
    payload: res,
  });
