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
import styles from '../Sigin/styles';
import {icon,passeye} from '../../assets';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

import {useIsFocused} from '@react-navigation/native';
export default function Signin(props) {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [switchEye,setswitchEye] = useState(false);

    return (
        // <View style={{flex:1}}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                style={{height:Dimensions.get('window').height}}
                >
                    <Image
                        source={icon}
                        style={styles.imgContainer}
                    />
    
                    <View style={{width:'90%',alignSelf:'center',top:responsiveHeight(15)}}>
                        <Text style={styles.labelstyle}>Email</Text>
                        <TextInput
                            placeholder='Sample@gmail.com'
                            placeholderTextColor={'#CCCCCC'}
                            style={[styles.input]}
                        />
                        <Text style={[styles.labelstyle,{fontSize:16,fontFamily:'Poppins',top:30}]}>Password</Text>
                        <TextInput
                            placeholder='********'
                            placeholderTextColor={'#CCCCCC'}
                            secureTextEntry={switchEye? true : false}
                            style={[styles.input,{marginTop:responsiveHeight(3.8)}]}
                        />
                        <View style={{width:'100%',alignItems:'flex-end',bottom:responsiveHeight(2.5)}}> 
                        {switchEye?
                            <TouchableOpacity
                                onPress={()=> setswitchEye(false)}
                                
                            >
                                <Image
                                    source={passeye}
                                    style={{width:16,height:16,marginRight:10}}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={()=> setswitchEye(true)}
                            >
                                <Image
                                    source={passeye}
                                    style={{width:16,height:16,marginRight:10}}
                                />
                            </TouchableOpacity>
                        }
                        </View>
                        <View
                            style={{width:'100%',alignItems:'flex-end'}}
                        >
                            <TouchableOpacity>
                                <Text style={[styles.labelstyle,{fontFamily:'Poppins',fontSize:14,top:30}]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View> 
                        <View
                            style={{top:responsiveHeight(10)}}
                        >
                            <TouchableOpacity onPress={()=>props.navigation.navigate('Root')}>
                                <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                                    style={styles.loginbtn}
                                    >
                                    <Text style={[styles.labelstyle,{fontWeight:'700'}]}>Sign In</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={{top:responsiveHeight(14),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style={[styles.labelstyle,{fontSize:12}]}>Don't have an account ? </Text>
                            <TouchableOpacity onPress={()=> props.navigation.navigate('Signup')}>
                                <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'900',color:'#FF5959'}]}> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </LinearGradient>


            </ScrollView>
        // </View>
    )
}
