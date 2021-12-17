import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AudioBanner from '../screens/bottomTab/playing';
import Track from '../screens/bottomTab/trackplayer';

import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

const AudiofileStack = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator
      independent={true}
      >
      <Stack.Screen component={Track} name="Track" options={{ headerShown: false }} />
      <Stack.Screen component={AudioBanner} name="AudioBanner" options={{ headerShown: false }} />
      {/* <Stack.Screen component={SignupScreen} name="Signup" /> */}
      {/* <Stack.Screen component={Forgot} name="Forgot" /> */}
      
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default AudiofileStack;
