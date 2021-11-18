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
import {connect} from 'react-redux';
import {registerUser, Googlelogin} from '../../redux/actions/auth';
import Snackbar from 'react-native-snackbar';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
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


  

const  SignUp = (props) => {

    const [gloading, setgLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmpass,setconfirmpass] = useState('');
    const [fullName,setfullName] = useState('');
    const [switchEye,setswitchEye] = useState(false);
    const [conswitchEye,setCoswitchEye] = useState(false);
    const [emailMessage, setemailMessage] = useState('');
    const [passwordMessage, setpasswordMessage] = useState('');
    const [confirmMessage, setconfirmMessage] = useState('');
    const [fNameMessage, setfNameMessage] = useState('');


    useEffect(() => {
      GoogleSignin.configure({
        webClientId:
          '237114661060-g9vl5km5n8juo3u8e80tin1rtpchm8v3.apps.googleusercontent.com',
        offlineAccess: true,
        client_type: 3,
        // iosClientId:
        //   '664178336819-pfg0mvocbu3sml19e499di4145i0qmvv.apps.googleusercontent.com',
      });
    }, []);

    async function onGoogleLoginPress() {
      try {
        await GoogleSignin.hasPlayServices();
        const googlePromise = await GoogleSignin.signIn();
        const userInfo = (await GoogleSignin.getCurrentUser().then(googlePromise))
          .user;
        if (userInfo) {
          const params = {
            google_UID: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.givenName,
            lastName: userInfo.familyName,
            image: userInfo.photo,
          };
          console.log(userInfo);
          const res = await props.Googlelogin(params);
  
          if (res?.payload?.data) {
            setgLoading(false);
            setLoading(false);
            navigation.navigate('Root');
            console.log('tokens', props.token);
            Snackbar.show({
              text: 'Signup succesfully',
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
          } else {
            setLoading(false);
            setgLoading(false);
            // await GoogleSignin.revokeAccess();
            Snackbar.show({
              text: 'Email already in use',
              backgroundColor: '#F14336',
              textColor: 'white',
            });
          }
        }
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
          console.log(error);
        }
      }
    }


    async function onregister() {
      setconfirmMessage('');
      setemailMessage('');
      setfNameMessage('');
      setpasswordMessage('');
      setconfirmMessage('');
      if (
        password !== '' &&
        confirmpass !== '' &&
        fullName !== '' &&
        email !== ''
      ) {
        const params = {
          fullName: fullName,
          // lastName: lName,
          email: email,
          password: password,
        };
        if(ValidateName(fullName)) {
            // alert('Called name ')
          if(password.length > 6 || password.length === 6){
            if (password === confirmpass) {
              const re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              const emailValid = re.test(email);
      
              if (emailValid) {
                const res = await props.registerUser(params);
                console.log('Api response', res?.data);
                if (res?.payload?.data) {
                  console.log('called if signup')
                  setLoading(false);
                  props.navigation.navigate('Signin');
                  Snackbar.show({
                    text: 'Signup succesfully',
                    backgroundColor: '#018CAB',
                    textColor: 'white',
                  });
                } else {
                  console.log('called else signup')
                  setLoading(false);
                  Snackbar.show({
                    text: 'This email already exists',
                    backgroundColor: '#018CAB',
                    textColor: 'white',
                  });
                }
              } else {
                setLoading(false);
                setemailMessage('Kindly enter correct email');
              }
            } else {
              setLoading(false);
              setconfirmMessage('Both passwords Must be match');
            }
          }else{
            setLoading(false);
            setpasswordMessage('Password length must be 6 characters minimum');
          }      
      }else{
        setLoading(false);
        setfNameMessage('Full name should only be letters');
      }
      } else {
        setLoading(false);
        if (
          password === '' &&
          confirmpass === '' &&
          fullName === ''
        ) {
          setconfirmMessage('Kindly enter confirm password');
          setemailMessage('Kindly enter email');
          setpasswordMessage('Kindly enter password');
          setfNameMessage('Kindly enter full name');
        }
  
        if (email === '') {
          setemailMessage('Kindly enter email');
        }
        if (password === '') {
          setpasswordMessage('Kindly enter password');
        }
        if (fullName === '') {
          setfNameMessage('Kindly enter full name');
        }
        
        if (confirmpass === '') {
          setconfirmMessage('Kindly enter confirm password');
        }
        return false;
      }
      }

      const validatefirstname = (lastname) => {
        if (/(?=[A-Za-z])/.test(lastname)) {
          return false;
        }
        return true;
      }

      const ValidateName = (Name) => {
        var regExp = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
        var name = Name.match(regExp);
        if (name) {
    
          return true;
        }
        return false;
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
    
                    <View style={{width:'90%',alignSelf:'center',top:responsiveHeight(10)}}>
                        <Text style={styles.labelstyle}>Full Name</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={value => setfullName(value)}
                            placeholder='Full Name'
                            placeholderTextColor={theme.colors.secondary}
                            style={[styles.input,{
                                borderBottomColor: fNameMessage !== '' ? 'tomato' : theme.colors.secondary
                            }]}
                        />
                       {fNameMessage !== '' && <Errors errors={fNameMessage} />}
                        <Text style={[styles.labelstyle,{marginTop:20}]}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={value => setEmail(value)}
                            placeholder='Sample@gmail.com'
                            placeholderTextColor={theme.colors.secondary}
                            style={[styles.input,{
                              borderBottomColor: emailMessage !== '' ? 'tomato' : theme.colors.secondary
                            }]}
                        />
                        {emailMessage !== '' && <Errors errors={emailMessage} />}
                        <Text style={[styles.labelstyle,{marginTop:20}]}>Password</Text>
                        <View style={{
                          borderBottomColor: confirmMessage !== '' ? 'tomato' : theme.colors.secondary,borderBottomWidth:1
                        }} >
                          <TextInput
                              value={password}
                              onChangeText={value => setPassword(value)}
                              placeholder='********'
                              placeholderTextColor={theme.colors.secondary}
                              secureTextEntry={!switchEye? true : false}
                              style={[styles.input,{
                                width:'90%',borderBottomWidth:0
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
                                    style={{width:14.34,height:9,marginRight:responsiveWidth(2)}}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={()=> setswitchEye(true)}
                            >
                                <Image
                                    source={passeye}
                                    style={{width:14.34,height:9,marginRight:responsiveWidth(2)}}
                                />
                            </TouchableOpacity>
                        }
                        </View>
                        {passwordMessage !== '' && <Errors errors={passwordMessage} />}
                        <Text style={[styles.labelstyle,{marginTop:10}]}>Confirm Password</Text>
                        <View style={{
                          borderBottomColor: confirmMessage !== '' ? 'tomato' : theme.colors.secondary,borderBottomWidth:1
                        }} >
                        <TextInput
                            value={confirmpass}
                            onChangeText={value => setconfirmpass(value)}
                            placeholder='********'
                            placeholderTextColor={theme.colors.secondary}
                            secureTextEntry={!conswitchEye? true : false}
                            style={[styles.input,{width:'90%',borderBottomWidth:0}]}
                        />
                        </View>
                        
                        <View style={{width:'100%',alignItems:'flex-end',bottom:responsiveHeight(2.5)}}> 
                        {conswitchEye?
                            <TouchableOpacity
                                onPress={()=> setCoswitchEye(false)}
                                
                            >
                                <Image
                                    source={passeye}
                                    style={{width:14.34,height:9,marginRight:responsiveWidth(2)}}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={()=> setCoswitchEye(true)}
                            >
                                <Image
                                    source={passeye}
                                    style={{width:14.34,height:9,marginRight:responsiveWidth(2)}}
                                />
                            </TouchableOpacity>
                        }
                        </View>
                        {confirmMessage !== '' && <Errors errors={confirmMessage} />}
                        <View
                            style={{top:responsiveHeight(5)}}
                        >
                            <TouchableOpacity onPress={()=> {
                                setLoading(true), onregister();
                              }} >
                                <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                                    style={styles.loginbtn}
                                    >
                                    {loading ? (
                                        <ActivityIndicator animating color={'white'} size={25} />
                                        ) : (
                                        <Text style={[styles.labelstyle,{fontWeight:'700'}]}>Sign Up</Text>
                                        )
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:responsiveHeight(8),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'700'}]}>Or connect with</Text>
                        </View>
                        <View style={{marginTop:responsiveHeight(3.5),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <TouchableOpacity  onPress={()=>{onGoogleLoginPress(), setgLoading(true);}} style={{width:39,height:39,justifyContent:'center',borderRadius:100,backgroundColor:'white'}}>
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
                        <View style={{marginTop:responsiveHeight(6),marginBottom:responsiveHeight(4),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style={[styles.labelstyle,{fontSize:12}]}>Already have an account ? </Text>
                            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                                <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'900',color:'#FF5959'}]}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                </LinearGradient>
                {gloading ? (
                  <ActivityIndicator
                    style={{
                      position: 'absolute',
                      top: Dimensions.get('window').height / 2,
                      alignSelf: 'center',
                    }}
                    animating
                    color={theme.colors.primary}
                    size={70}
                  />
                ) : null}

            </ScrollView>
        // </View>
    )
}

const mapStateToProps = state => {
    const {status, message, isLoading, errMsg, isSuccess, token} = state.auth;
    return {status, message, isLoading, errMsg, isSuccess, token};
  };
  export default connect(mapStateToProps, {registerUser, Googlelogin})(
    SignUp,
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