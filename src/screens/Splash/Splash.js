import React, {Component} from 'react';
import {View, StatusBar, ImageBackground,PermissionsAndroid,Image} from 'react-native';
import {splash,icon} from '../../assets';
import styles from './styles';
import {connect} from 'react-redux';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import { firebase } from '@react-native-firebase/messaging';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import axios from 'axios';
import {BASE_URL} from '../../redux/base-url';
import Snackbar from 'react-native-snackbar';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPage: 'OnBoarding',
      idAddress:'',
      Fcmtoken:''
    };
  }
  componentDidMount = () => {
    if(this.props.isLoggedIn){
      if(this.props?.userData?.token){
        this.checkInternet();
      }else{
        // alert(this.props?.userData?.token)
        this.validateLogin()  
      }
    }else{
      this.validateLogin()
    }
    // this.requestToPermissions()
  };

  async  checkInternet (){
    // alert("called 2 ")
    NetInfo.fetch().then((state) => {
      // setConnect(state.isConnected)
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected,state.details.ipAddress);
    
        if (state.isConnected) {
          // alert(state.isConnected)
          this.notificationFun(state.details.ipAddress)
         
        } else {
          this.validateLogin()
        }
      
    });
  }

   notificationFun = async(ipAdres) =>{
    // return alert(ipAdres)
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
      this.splashDone(ipAdres,fcmToken)
        // console.log("fcmTokenn", fcmToken)
        // console.log('Firebase TOKENnn==> ', fcmToken);
        // setFcmtoken(fcmToken)
        // this.setState({Fcmtoken:fcmToken})
      // alert('Firebase TOKEN Upload==> '+ fcmToken);
    } else {
      console.warn('no token');
     
    }


  }

  splashDone = async (ipAdres,fcmToken) => {
    // alert('called')
    try{
      const params = {
        'access_token':this.props?.userData?.token,
        'ipAddress':ipAdres,
        'connectionTime':moment().format("YYYY-MM-DD hh:mm:ss a"),
        'fcmToken': fcmToken
      }
      console.log(params) ;
      const res = await axios.post(`${BASE_URL}api/relax/user/postAuth`,(params), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      // console.log(res?.data)
      // alert(JSON.stringify(res.data))

      if(res?.data?.msg){
          // alert('called 1')
          this.props.navigation.replace('Signin');
          // alert(JSON.stringify(res.data))
          Snackbar.show({
            text: res.data.msg,
            backgroundColor: '#F14336',
            textColor: 'white',
          });
      }else{
        // alert('called 2')
        this.props.navigation.replace('Main');

      }
    }catch(e){
      console.log(e);
      // alert(e)
      this.props.navigation.replace('Signin');
    
    }
    // alert(fcmToken)
    // console.log(this.props?.userData?.token);
    
  };

  validateLogin (){
    // alert("valdate login")
    setTimeout(() => {
      this.props.navigation.replace(this.props.isLoggedIn ? 'Main' : 'Signin');
      // this.props.navigation.navigate('Signin');
    }, 1200);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar hidden={true} />
        <ImageBackground
          source={splash}
          style={styles.splashStyle}
          // resizeMode={'contain'}
        >
          <Image
            source={icon}
            style={{height:86,width:261,alignSelf:'center',top:responsiveScreenHeight(78)}}
          />
        </ImageBackground>
      </View>
    );
  }
}
const mapStateToProps = state => {
  const {isLoggedIn,userData} = state.auth;
  return {isLoggedIn,userData};
};

export default connect(mapStateToProps)(Splash);
