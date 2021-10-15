import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import {cross, lfb, lgb,apple,google} from '../../assets';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

import {useIsFocused} from '@react-navigation/native';
export default function Signin() {
    return (
        // <View style={{flex:1}}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#4c669f', '#3b5998', '#192f6a']}
                >

    
                    <Text>Signin</Text>

                </LinearGradient>


            </ScrollView>
        // </View>
    )
}
