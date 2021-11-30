/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useRef} from 'react';
import {View, LogBox, PermissionsAndroid, NativeModules} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Snackbar from 'react-native-snackbar';
import NetInfo from "@react-native-community/netinfo";


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
import Payment from '../screens/bottomTab/payment'
import Contact from '../screens/bottomTab/contact_us';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const setting = () => {
  return (
    <Stack.Navigator
    initialRouteName="Setting"
    screenOptions={{
      animationTypeForReplace: 'pop',
      headerShown: false,
    }}>
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
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
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
      <Stack.Screen
        name="Packages"
        component={Packages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
      />

    </Stack.Navigator>
  );
};

const explore = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{headerShown: false}}
      />      
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Packages"
        component={Packages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
      />


    </Stack.Navigator>
  );
};

const music = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Music"
        component={Music}
        options={{headerShown: false}}
      />      
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Packages"
        component={Packages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
      />


    </Stack.Navigator>
  );
}

const favor = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Fav"
        component={Fav}
        options={{headerShown: false}}
      />      
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{headerShown: false}}
      />
      


    </Stack.Navigator>
  );
}

function Tabbar({navigation,props}) {

  useEffect(() => {
    CheckConnectivity()
    // get_category()
    // setcateEmp(false)
    // setisplaying (false)

}, [])

  function CheckConnectivity  ()  {
    // For Android devices
    // alert("called")
    NetInfo.fetch().then((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected,state.isInternetReachable);
      //if (Platform.OS === "android") {
        if (state.isConnected) {
        } else {
          Snackbar.show({
            text: 'You are not Connected to Internet, Continuing Offline!',
            backgroundColor: '#018CAB',
            textColor: 'white',
          });
        }
      
    });
  };

// console.log(navigation);
  return (
      // <NavigationContainer independent={true}>
        <Tab.Navigator
        independent={true}
        swipeEnabled={false}
          tabBarPosition={'bottom'} 
          tabBar={(props) => <BottomTab {...props} />}>
              <Tab.Screen name="Home" component={feed} />
              <Tab.Screen name="Explore" component={explore} />
              <Tab.Screen name="Music" component={music} />
              <Tab.Screen name="Fav" component={favor} />
              <Tab.Screen name="Setting" component={setting} />
        </Tab.Navigator>
    // </NavigationContainer>
  );
}


export default Tabbar;
