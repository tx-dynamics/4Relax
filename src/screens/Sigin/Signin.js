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

import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
import {connect} from 'react-redux';
import {
    loginUser,
    Googlelogin,
    logoOut,
    authFailed,
  } from '../../redux/actions/auth';
import {useIsFocused} from '@react-navigation/native';

const Signin  =  props => {

    const [loading, setLoading] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [switchEye,setswitchEye] = useState(false);
    const [emailMessage, setemailMessage] = useState('');
    const [passwordMessage, setpasswordMessage] = useState('');
    const navigation = props.navigation;

    

    async function onLogin() {
        setemailMessage('');
        setpasswordMessage('');
        try {
          if (email !== '' && password !== '') {
            const params = {
              email: email,
              password: password,
            };
            const re =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const emailValid = re.test(email);
    
            if (emailValid) {
              const res = await props.loginUser(params);
              setemailMessage('');
              setpasswordMessage('');
              console.log('api respone', res);
              //res?.data?.logged
              if (res?.payload?.data) {
                setLoading(false);
                navigation.navigate('Root');
                console.log('tokens', props.token);
                Snackbar.show({
                  text: 'Sign in succesfully',
                  backgroundColor: '#018CAB',
                  textColor: 'white',
                });
              } else {
                authFailed(res);
                setLoading(false);
                Snackbar.show({
                  text: 'Invalid Email and Password',
                  backgroundColor: '#F14336',
                  textColor: 'white',
                });
              }
            } else {
              setLoading(false);
              setemailMessage('Kindly enter correct email');
              P;
              return false;
            }
          } else {
            setLoading(false);
            if (email === '' && password === '') {
              setemailMessage('Kindly enter email');
              setpasswordMessage('Kindly enter password');
            }
    
            if (email === '') {
              setemailMessage('Kindly enter email');
            }
            if (password === '') {
              setpasswordMessage('Kindly enter password');
            }
            return false;
          }
        } catch (err) {
          setLoading(false);
    
          Snackbar.show({
            text: err.message,
            backgroundColor: '#F14336',
            textColor: 'white',
          });
          return false;
        }
      }


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
                            value={email}
                            onChangeText={value => setEmail(value)}
                            placeholder='Sample@gmail.com'
                            placeholderTextColor={'#CCCCCC'}
                            style={[styles.input,{
                                borderBottomColor:emailMessage !== '' ? 'tomato' : '#CCCCCC'
                            }]}
                        />
                        {emailMessage !== '' && <Errors errors={emailMessage} />}

                        <Text style={[styles.labelstyle,{fontSize:16,fontFamily:'Poppins',top:30}]}>Password</Text>
                        <View style={{
                          borderBottomColor: passwordMessage !== '' ? 'tomato' : '#CCCCCC',borderBottomWidth:1
                        }} >
                          <TextInput
                            value={password}
                            onChangeText={value => setPassword(value)}
                            placeholder='********'
                            placeholderTextColor={'#CCCCCC'}
                            secureTextEntry={!switchEye? true : false}
                            style={[styles.input,{marginTop:responsiveHeight(3.8),
                                borderBottomWidth:0
                            }]}
                        />
                        </View>
                        
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
                        {passwordMessage !== '' && <Errors errors={passwordMessage} />}

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
                            <TouchableOpacity onPress={()=>{
                                setLoading(true),
                                onLogin()
                            }}>
                                <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                                    style={styles.loginbtn}
                                    >
                                         {loading ? (
                                            <ActivityIndicator animating color={'white'} size={25} />
                                            ) : (
                                            <Text style={[styles.labelstyle,{fontWeight:'700'}]}>Sign In</Text>
                                            )
                                        }
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
const mapStateToProps = state => {
    const {status, message, isLoading, errMsg, isSuccess, token, islogin} =
      state.auth;
    return {status, message, isLoading, errMsg, isSuccess, token, islogin};
  };
  export default connect(mapStateToProps, {loginUser, Googlelogin, logoOut})(
    Signin,
  );
  export function Errors({errors}) {
    return (
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          width: '95%',
          alignSelf: 'center',
          marginTop: 5,
          color: 'red',
        }}>
        {errors}
      </Text>
    );
  }