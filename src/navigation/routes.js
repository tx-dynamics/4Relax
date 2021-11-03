/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {View, LogBox, PermissionsAndroid, NativeModules} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import BottomTab from './bottomtab'
import Feed from '../screens/bottomTab/feed'
import Explore from '../screens/bottomTab/explore'
import Music from '../screens/bottomTab/music'
import Fav from '../screens/bottomTab/favourities'
import Setting from '../screens/bottomTab/setting'
import Subscription from '../screens/bottomTab/subscribtion'
import Packages from '../screens/bottomTab/sub_packages'
import Downloads from '../screens/bottomTab/donloads'
import Activation from '../screens/bottomTab/activation'
import AudioPlayer from '../screens/bottomTab/soundplayer'
import Stripe from '../screens/bottomTab/payment_method/mian'

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const setting = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Packages"
        component={Packages}
        options={{headerShown: false}}
      />

    <Stack.Screen
        name="Downloads"
        component={Downloads}
        options={{headerShown: false}}
      />   
      <Stack.Screen
        name="Activation"
        component={Activation}
        options={{headerShown: false}}
      />    

      <Stack.Screen
        name="Stripe"
        component={Stripe}
        options={{headerShown: false}}
      />

    </Stack.Navigator>
  );
};

const feed = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Feed}
        options={{headerShown: false}}
      />      
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{headerShown: false}}
      />
      


    </Stack.Navigator>
  );
};

const   Tabbar = () =>{
// alert("key ="+ JSON.stringify(key));
// if(key === 0){
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                 <Stack.Screen name="Home" component={setting} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
// }else{
//     <NavigationContainer independent={true}>
//         <Stack.Navigator>
//             <Stack.Screen name="Home" component={feed} />
//         </Stack.Navigator>
//     </NavigationContainer>
// }

  
}


export default Tabbar;
