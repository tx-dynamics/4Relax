import React, { useState, useEffect } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { icon, passeye, apple, google } from '../../assets';
import { connect } from 'react-redux';
import { registerUser, Googlelogin, googleLoginApi } from '../../redux/actions/auth';
import Snackbar from 'react-native-snackbar';
import GoogleSign from '../../components/GoogleSign';
import axios from 'axios';
import {BASE_URL} from '../../redux/base-url';


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

import { useIsFocused } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';



const SignUp = (props) => {

  const [gloading, setgLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpass, setconfirmpass] = useState('');
  const [fullName, setfullName] = useState('');
  const [switchEye, setswitchEye] = useState(false);
  const [conswitchEye, setCoswitchEye] = useState(false);
  const [emailMessage, setemailMessage] = useState('');
  const [passwordMessage, setpasswordMessage] = useState('');
  const [confirmMessage, setconfirmMessage] = useState('');
  const [fNameMessage, setfNameMessage] = useState('');
  const [placeholderName, setplaceholderName] = useState('Full Name');
  const [placeholderEmail, setplaceholderEmail] = useState('Sample@gmail.com');
  const [placeholderPass, setplaceholderPass] = useState('********');
  const [placeholderConPass, setplaceholderConPass] = useState('********');
  const [ipAddress, setipAddress] = useState('');
  const [Fcmtoken, setFcmtoken] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    checkInternet()
    // GoogleSignin.configure({
    //   webClientId:
    //     '237114661060-g9vl5km5n8juo3u8e80tin1rtpchm8v3.apps.googleusercontent.com',
    //   offlineAccess: true,
    //   client_type: 3,
    // iosClientId:
    //   '664178336819-pfg0mvocbu3sml19e499di4145i0qmvv.apps.googleusercontent.com',
    // });
  }, [isFocused]);

  async function checkInternet (){
    // alert("called 2 ")
    NetInfo.fetch().then((state) => {
      // setConnect(state.isConnected)
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected,state.details.ipAddress);
      setipAddress(state.details.ipAddress)
      //if (Platform.OS === "android") {
        if (state.isConnected) {
          // alert(state.isConnected)
          notificationFun()
        } else {
        }
      
    });
  }

  const notificationFun = async() =>{

    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
    } else {
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
      }
    }
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        // console.log("fcmTokenn", fcmToken)
        // console.log('Firebase TOKENnn==> ', fcmToken);
        setFcmtoken(fcmToken)
      // alert('Firebase TOKEN Upload==> '+ fcmToken);
    } else {
      console.warn('no token');
     
    }


  }

  const onGoogleLoginPress = async () => {
    let info = await GoogleSign();
    // alert(JSON.stringify(info.Data.userInfo.user.photo))
    // alert(JSON.stringify(info.Data.userInfo.user.name))
    // alert(JSON.stringify(info.Data.userInfo.user.id))
    // alert(JSON.stringify(info.Data.userInfo.user.email))

    let param = {};
    param['fullName'] = info.Data.userInfo.user.name;
    param['email'] = info.Data.userInfo.user.email;
    param['profileImage'] = info.Data.userInfo.user.photo;
    // const res = await props.googleLoginApi(params);

    axios({
      method: 'post',
      url: `${BASE_URL}api/relax/user/loginWithGoogle`,
      data: param
    }).then(function (response) {
      alert(JSON.stringify(response.data))
    })
    .catch(function (error) {
      alert(JSON.stringify(error))
    });


  }

  async function onGoogleLoginPresss() {
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
    try{
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
        ipAddress:ipAddress,
        connectionTime:moment().format("YYYY-MM-DD hh:mm:ss a"),
        fcmToken:Fcmtoken

      };
      if (ValidateName(fullName)) {
        // alert('Called name ')
        if (password.length > 6 || password.length === 6) {
          if (password === confirmpass) {
            const re =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const emailValid = re.test(email);

            if (emailValid) {
              // return alert(JSON.stringify(params))
              const res = await props.registerUser(params);
              console.log('Api response', res?.data);
              if (res?.payload?.data) {
                // console.log(email,"++++++++++++++++++++++++++++++++",password)
                setLoading(false);
                props.navigation.navigate('Signin',{email:email,password:password});
                Snackbar.show({
                  text: 'Signup successfully',
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
        } else {
          setLoading(false);
          setpasswordMessage('Password length must be 6 characters minimum');
        }
      } else {
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
    }catch(e){
    setLoading(false);
    Snackbar.show({
      text: "Some issue occured. Check internet and try again",
      backgroundColor: '#F14336',
      textColor: 'white',
    });
    // alert(e)    
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
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#018CAB', '#000A0D']}
        style={{ height: Dimensions.get('window').height }}
      >
        <Image
          source={icon}
          style={styles.imgContainer}
        />

        <View style={{ width: '90%', alignSelf: 'center', top: responsiveHeight(10) }}>
          <Text style={[styles.labelstyle,{}]}>Full Name</Text>
          <TextInput
            selectionColor={'#CCCCCC'}
            value={fullName}
            onChangeText={value => setfullName(value)}
            placeholder={placeholderName}
            onBlur={()=>fullName === ''? setplaceholderName("Full Name"): null}
            onFocus={() => setplaceholderName('')}
            placeholderTextColor={theme.colors.secondary}
            style={[styles.input, {
              borderBottomColor: fNameMessage !== '' ? 'tomato' : theme.colors.secondary
            }]}
          />
          {fNameMessage !== '' && <Errors errors={fNameMessage} />}
          <Text style={[styles.labelstyle, { marginTop: 20 }]}>Email</Text>
          <TextInput
            selectionColor={'#CCCCCC'}
            value={email}
            onChangeText={value => setEmail(value.trim())}
            placeholder={placeholderEmail}
            onBlur={()=>email === ''? setplaceholderEmail("Sample@gmail.com"): null}
            onFocus={() => setplaceholderEmail('')}
            placeholderTextColor={theme.colors.secondary}
            style={[styles.input, {
              borderBottomColor: emailMessage !== '' ? 'tomato' : theme.colors.secondary
            }]}
          />
          {emailMessage !== '' && <Errors errors={emailMessage} />}
          <Text style={[styles.labelstyle, { marginTop: 20}]}>Password</Text>
          <View style={{
            borderBottomColor: confirmMessage !== '' ? 'tomato' : theme.colors.secondary, borderBottomWidth: 1
          }} >
            <TextInput
              selectionColor={'#CCCCCC'}
              value={password}
              onChangeText={value => setPassword(value)}
              placeholder={placeholderPass}
              onBlur={()=>password === ''? setplaceholderPass("********"): null}
              onFocus={() => setplaceholderPass('')}
              placeholderTextColor={theme.colors.secondary}
              secureTextEntry={!switchEye ? true : false}
              style={[styles.input, {
                width: '90%', borderBottomWidth: 0
              }]}
            />
          </View>

          <View style={{ alignSelf:'flex-end', alignItems: 'flex-end', bottom: responsiveHeight(4) }}>
            {switchEye ?
              <TouchableOpacity
                onPress={() => setswitchEye(false)}
                style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}
              >
                <Image
                  source={passeye}
                  style={{ width: 14.34, height: 9 }}
                />
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => setswitchEye(true)}
                style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}
              >
                <Image
                  source={passeye}
                  style={{ width: 14.34, height: 9 }}
                />
              </TouchableOpacity>
            }
          </View>
          <View style={{bottom:responsiveHeight(2)}} >
            {passwordMessage !== '' && <Errors errors={passwordMessage} />}
          </View>
          <Text style={[styles.labelstyle, { marginTop: 10}]}>Confirm Password</Text>
          <View style={{
            borderBottomColor: confirmMessage !== '' ? 'tomato' : theme.colors.secondary, borderBottomWidth: 1
          }} >
            <TextInput
              selectionColor={'#CCCCCC'}
              value={confirmpass}
              onChangeText={value => setconfirmpass(value)}
              placeholder={placeholderConPass}
              onBlur={()=>confirmpass === ''? setplaceholderConPass("********"): null}
              onFocus={() => setplaceholderConPass('')}
              placeholderTextColor={theme.colors.secondary}
              secureTextEntry={!conswitchEye ? true : false}
              style={[styles.input, { width: '90%', borderBottomWidth: 0 }]}
            />
          </View>

          <View style={{ alignSelf:'flex-end', alignItems: 'flex-end', bottom: responsiveHeight(4) }}>
            {conswitchEye ?
              <TouchableOpacity
                onPress={() => setCoswitchEye(false)}
                style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}
              >
                <Image
                  source={passeye}
                  style={{ width: 14.34, height: 9 }}
                />
              </TouchableOpacity>
              :
              <TouchableOpacity
                onPress={() => setCoswitchEye(true)}
              style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}>
                <Image
                  source={passeye}
                  style={{ width: 14.34, height: 9 }}
                />
              </TouchableOpacity>
            }
          </View>
          <View style={{bottom:responsiveHeight(2)}} >
            {confirmMessage !== '' && <Errors errors={confirmMessage} />}
          </View>
          <View
            style={{ top: responsiveHeight(5) }}
          >
            <TouchableOpacity onPress={() => {
              setLoading(true), onregister();
            }} >
              <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#018CAB', '#000A0D']}
                style={styles.loginbtn}
              >
                {loading ? (
                  <ActivityIndicator animating color={'white'} size={25} />
                ) : (
                    <Text style={[styles.labelstyle, { fontWeight: '700' }]}>Sign Up</Text>
                  )
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {/* <View style={{ marginTop: responsiveHeight(8), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={[styles.labelstyle, { fontSize: 14, fontWeight: '700' }]}>Or connect with</Text>
          </View>
          <View style={{ marginTop: responsiveHeight(3.5), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { onGoogleLoginPress()}} style={{ width: 39, height: 39, justifyContent: 'center', borderRadius: 100, backgroundColor: 'white' }}>
              <Image
                source={google}
                style={{ width: 24, height: 24, alignSelf: 'center' }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 25, justifyContent: 'center', width: 39, height: 39, borderRadius: 100, backgroundColor: 'white' }}>
              <Image
                source={apple}
                style={{ width: 19.5, height: 24, alignSelf: 'center' }}
              />
            </TouchableOpacity>
          </View> */}
          <View style={{ marginTop: responsiveHeight(18), marginBottom: responsiveHeight(4), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={[styles.labelstyle, { fontSize: 12 }]}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text style={[styles.labelstyle, { fontSize: 14, fontWeight: '900', color: '#FF5959' }]}> Sign In</Text>
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
  const { status, message, isLoading, errMsg, isSuccess, token } = state.auth;
  return { status, message, isLoading, errMsg, isSuccess, token };
};
export default connect(mapStateToProps, { registerUser, Googlelogin })(
  SignUp,
);
export function Errors({ errors }) {
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