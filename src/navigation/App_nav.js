/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {View, LogBox, PermissionsAndroid, NativeModules} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';


// import Signin from '../screens/Signin';
// import Splash from '../screens/Splash';
import AuthenticationStack from './Auth_nav';

//redux
// import {connect} from 'react-redux';

const Stack = createStackNavigator();

function AppNav({}) {
  let initial = 'Auth';

  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initial}>
        <Stack.Screen
          name="Auth"
          component={AuthenticationStack}
          options={{
            headerShown: false,
          }}
        />

        {/* <Stack.Screen name="Root" options={{headerShown: false}}>
          {props => <BottomTab {...props} />}
        </Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default AppNav;
