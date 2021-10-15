import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from '../screens/SignUp';
import Signin from '../screens/Sigin';
import Splash from '../screens/Splash';


const Stack = createStackNavigator();

const AuthenticationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        animationTypeForReplace: 'pop',
        headerShown: false,
      }}>
      <Stack.Screen component={Splash} name="Splash" />
      <Stack.Screen component={Signin} name="Signin" />
      <Stack.Screen component={SignupScreen} name="Signup" />
      
    </Stack.Navigator>
  );
};

export default AuthenticationStack;
