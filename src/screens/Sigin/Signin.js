import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import theme from '../../theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from '../Sigin/styles';
import {icon,passeye,apple, google} from '../../assets';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
  
} from 'react-native-responsive-dimensions';
import GoogleSign from '../../components/GoogleSign';
import Snackbar from 'react-native-snackbar';
import {useIsFocused} from '@react-navigation/native';
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
    googleLoginApi
  } from '../../redux/actions/auth';

const Signin  =  props => {

    const [loading, setLoading] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [switchEye,setswitchEye] = useState(false);
    const [emailMessage, setemailMessage] = useState('');
    const [passwordMessage, setpasswordMessage] = useState('');
    const [placeholder, setplaceholder] = useState('Sample@gmail.com');
    const [placeholderPass, setplaceholderPass] = useState('********');
    const navigation = props.navigation;
    const isFocused = useIsFocused();

    useEffect(() => {
      let email = props?.route?.params?.email
      let password = props?.route?.params?.password
      if(email == undefined || password == undefined){
        // alert('not found')
      }else{
        setEmail(email)
        setPassword(password)
      }
      // console.log(email,password)
    }, [isFocused]);

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
                navigation.replace('Root');
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
              // P;
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

      const onGoogleLoginPress = async () => {
        let info = await GoogleSign();
        // alert(JSON.stringify(info.Data.userInfo.user.photo))
        // alert(JSON.stringify(info.Data.userInfo.user.name))
        // alert(JSON.stringify(info.Data.userInfo.user.id))
        // alert(JSON.stringify(info.Data.userInfo.user.email))
    
        let param = {};
        param['fullName'] = info.Data.userInfo.user.name;
        param['email'] = info.Data.userInfo.user.email;
        // param['email'] = "info.Data.userInfo.user.email";
        param['profileImage'] = info.Data.userInfo.user.photo;
        // const res = await props.googleLoginApi(params);
    
        try{
          const res = await props.googleLoginApi(param);
          setemailMessage('');
          setpasswordMessage('');
          console.log('api respone', res);
          //res?.data?.logged
          if (res?.payload?.data) {
            setLoading(false);
            navigation.replace('Root');
            // console.log('tokens', props.token);
            Snackbar.show({
              text: res?.payload?.data?.msg,
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
          } else {
            authFailed(res);
            setLoading(false);
            Snackbar.show({
              text: 'Invalid Email',
              backgroundColor: '#F14336',
              textColor: 'white',
            });
          }
        }catch(e){
            console.log(e);
        }

        // axios({
        //   method: 'post',
        //   url: `${BASE_URL}api/relax/user/loginWithGoogle`,
        //   data: param
        // }).then(function (response) {
        //   alert(JSON.stringify(response.data))
        // })
        // .catch(function (error) {
        //   alert(JSON.stringify(error))
        // });
    
    
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
                        <Text style={[styles.labelstyle,{}]}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={value => setEmail(value.trim())}
                            placeholder={placeholder}
                            onBlur={()=>email === ''? setplaceholder("Sample@gmail.com"): null}
                            onFocus={() => setplaceholder('')}
                            placeholderTextColor={theme.colors.secondary}
                            style={[styles.input,{
                                borderBottomColor:emailMessage !== '' ? 'tomato' : theme.colors.secondary
                            }]}
                        />
                        {emailMessage !== '' && <Errors errors={emailMessage} />}

                        <Text style={[styles.labelstyle,{top:30}]}>Password</Text>
                        <View style={{
                          borderBottomColor: passwordMessage !== '' ? 'tomato' : theme.colors.secondary,borderBottomWidth:1
                        }} >
                          <TextInput
                            value={password}
                            onChangeText={value => setPassword(value)}
                            placeholder={placeholderPass}
                            onBlur={()=>password === ''? setplaceholderPass("********"): null}
                            onFocus={() => setplaceholderPass('')}
                            placeholderTextColor={theme.colors.secondary}
                            secureTextEntry={!switchEye? true : false}
                            style={[styles.input,{marginTop:responsiveHeight(3.8),
                                borderBottomWidth:0,width:'90%'
                            }]}
                        />
                        </View>
                        
                        <View style={{alignSelf:'flex-end',alignItems:'flex-end',height:'auto',bottom:responsiveHeight(4)}}> 
                        {switchEye?
                            <TouchableOpacity
                                onPress={()=> setswitchEye(false)}
                                style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}
                            >
                                <Image
                                    source={passeye}
                                    style={{width:14.34,height:9,justifyContent:'center'}}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={()=> setswitchEye(true)}
                                style={{height:20,width:20,justifyContent:'center',alignItems:'center'}}

                            >
                                <Image
                                    source={passeye}
                                    style={{width:14.34,height:9,justifyContent:'center'}}
                                />
                            </TouchableOpacity>
                        }

                        </View>
                        <View style={{bottom:responsiveHeight(2)}} >
                          {passwordMessage !== '' && <Errors errors={passwordMessage} />}
                        </View>

                        <View
                            style={{width:'100%',alignItems:'flex-end'}}
                        >
                            <TouchableOpacity onPress={()=>props.navigation.navigate('Forgot')}>
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
                        <View style={{ marginTop: responsiveHeight(15), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={[styles.labelstyle, { fontSize: 14, fontWeight: '700' }]}>Or connect with</Text>
                          </View>
                          <View style={{ marginTop: responsiveHeight(3.5), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => { onGoogleLoginPress()}} style={{ width: 39, height: 39, justifyContent: 'center', borderRadius: 100, backgroundColor: 'white' }}>
                              <Image
                                source={google}
                                style={{ width: 24, height: 24, alignSelf: 'center' }}
                              />
                            </TouchableOpacity>
                            {Platform.ios?
                              <TouchableOpacity style={{ marginLeft: 25, justifyContent: 'center', width: 39, height: 39, borderRadius: 100, backgroundColor: 'white' }}>
                                <Image
                                  source={apple}
                                  style={{ width: 19.5, height: 24, alignSelf: 'center' }}
                                />
                              </TouchableOpacity>
                            :
                              null
                            }
                            
                          </View>
                        <View style={{top:responsiveHeight(10),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
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
  export default connect(mapStateToProps, {loginUser, googleLoginApi, logoOut})(
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