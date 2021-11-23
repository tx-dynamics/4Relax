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
  forgotpassword
  } from '../../redux/actions/auth';
import {useIsFocused} from '@react-navigation/native';

const Forgot  =  props => {

    const [loading, setLoading] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [switchEye,setswitchEye] = useState(false);
    const [emailMessage, setemailMessage] = useState('');
    const [passwordMessage, setpasswordMessage] = useState('');
    const navigation = props.navigation;
    const [placeholder, setplaceholder] = useState('Sample@gmail.com');

    

    async function onLogin() {
        setemailMessage('');
        try {
          if (email !== '') {
            const params = {
              email: email,
            };
            const re =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const emailValid = re.test(email);
    
            if (emailValid) {
              const res = await props.forgotpassword(params);
              setemailMessage('');
              setpasswordMessage('');
              console.log('api respone', res);
              //res?.data?.logged
              if (res?.payload?.data) {
                setLoading(false);
                navigation.replace('Signin');
                console.log('tokens', props.token);
                Snackbar.show({
                  text: 'Email sent successfully',
                  backgroundColor: '#018CAB',
                  textColor: 'white',
                });
              } else {
                authFailed(res);
                setLoading(false);
                Snackbar.show({
                  text: 'Invalid Email ',
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
            if (email === '') {
              setpasswordMessage('Kindly enter password');
            }
    
            if (email === '') {
              setemailMessage('Kindly enter email');
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
                            onChangeText={value => setEmail(value.trim())}
                            // placeholder='Sample@gmail.com'
                            placeholder={placeholder}
                            onBlur={()=>email === ''? setplaceholder("Sample@gmail.com"): null}
                            onFocus={() => setplaceholder('')}
                            placeholderTextColor={theme.colors.secondary}
                            style={[styles.input,{
                                borderBottomColor:emailMessage !== '' ? 'tomato' : theme.colors.secondary
                            }]}
                        />
                        {emailMessage !== '' && <Errors errors={emailMessage} />}

                        
                        
                       
                        <View
                            style={{width:'100%',alignItems:'flex-end'}}
                        >
                            
                        </View> 
                        <View
                            style={{marginTop:responsiveHeight(40)}}
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
                                            <Text style={[styles.labelstyle,{fontWeight:'700'}]}>Send Email</Text>
                                            )
                                        }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={{top:responsiveHeight(8),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            {/* <Text style={[styles.labelstyle,{fontSize:12}]}>Don't have an account ? </Text> */}
                            <TouchableOpacity onPress={()=> props.navigation.replace('Signin')}>
                                <Text style={[styles.labelstyle,{fontSize:14,fontWeight:'900',color:'#FF5959'}]}> Sign In</Text>
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
  export default connect(mapStateToProps, {forgotpassword})(
    Forgot,
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