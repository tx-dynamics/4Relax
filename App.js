/* eslint-disable prettier/prettier */
import React,{useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persister, store} from './src/redux/store';
import AppNav from './src/navigation/App_nav';
import {View, YellowBox} from 'react-native';
import theme from './src/theme';
import {ThemeProvider} from 'react-native-elements';
import Orientation from "react-native-orientation-locker";
// import {useIsFocused} from '@react-navigation/native';

YellowBox.ignoreWarnings(['']);

const App = () => {
  // const isFocused = useIsFocused();

  // useEffect(() => {
  //   orientationLock();
  // }, [isFocused])

  // function orientationLock  () {
    Orientation.lockToPortrait();
  // }; //end of orientationLock

  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <ThemeProvider theme={theme}>
          <AppNav />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
