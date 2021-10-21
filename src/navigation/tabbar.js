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

const Tab = createMaterialTopTabNavigator();

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
              <Tab.Screen name="Setting" component={Setting} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}


export default Tabbar;
