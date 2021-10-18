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
import {icon,passeye,apple,google} from '../../assets';

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
    
                    <View style={{width:'90%',alignSelf:'center',top:responsiveHeight(10)}}>
                        <Text style={styles.labelstyle}>Full Name</Text>
                        <TextInput
                            placeholder='Full Name'
                            placeholderTextColor={'#CCCCCC'}
                            style={[styles.input]}
                        />
                       
                        <Text style={[styles.labelstyle,{marginTop:20}]}>Email</Text>
                        <TextInput
                            placeholder='Sample@gmail.com'
                            placeholderTextColor={'#CCCCCC'}
                            style={[styles.input,{}]}
                        />
                        <Text style={[styles.labelstyle,{marginTop:20}]}>Password</Text>
                        <TextInput
                            placeholder='********'
                            placeholderTextColor={'#CCCCCC'}
                            secureTextEntry={switchEye? true : false}
                            style={[styles.input,{}]}
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
                        <Text style={[styles.labelstyle,{marginTop:10}]}>Confirm Password</Text>
                        <TextInput
                            placeholder='********'
                            placeholderTextColor={'#CCCCCC'}
                            secureTextEntry={switchEye? true : false}
                            style={[styles.input,{}]}
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
                            style={{top:responsiveHeight(5)}}
                        >
                            <TouchableOpacity>
                                <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                                    style={styles.loginbtn}
                                    >
                                    <Text style={[styles.labelstyle,{fontWeight:'700'}]}>Sign Up</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:responsiveHeight(8),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'700'}]}>Or connect with</Text>
                        </View>
                        <View style={{marginTop:responsiveHeight(3.5),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <TouchableOpacity style={{width:39,height:39,justifyContent:'center',borderRadius:100,backgroundColor:'white'}}>
                                <Image
                                    source={google}
                                    style={{width:24,height:24,alignSelf:'center'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:25,justifyContent:'center',width:39,height:39,borderRadius:100,backgroundColor:'white'}}>
                            <Image
                                    source={apple}
                                    style={{width:19.5,height:24,alignSelf:'center'}}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{top:responsiveHeight(10),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style={[styles.labelstyle,{fontSize:12}]}>Already have an account ? </Text>
                            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                                <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'900',color:'#FF5959'}]}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                </LinearGradient>


            </ScrollView>
        // </View>
    )
}
