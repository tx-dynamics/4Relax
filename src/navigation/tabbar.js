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

    </Stack.Navigator>
  );
};


function Tabbar({}) {


  return (
      <NavigationContainer independent={true}>
        <Tab.Navigator
          tabBarPosition={'bottom'} 
          tabBar={(props) => <BottomTab {...props} />}>
              <Tab.Screen name="Home" component={Feed} />
              <Tab.Screen name="Explore" component={Explore} />
              <Tab.Screen name="Music" component={Music} />
              <Tab.Screen name="Fav" component={Fav} />
              <Tab.Screen name="Setting" component={setting} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}


export default Tabbar;
