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
YellowBox.ignoreWarnings(['']);

const App = () => {
  
    Orientation.lockToPortrait();
 
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
