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
class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPage: 'OnBoarding',
    };
  }
  componentDidMount = () => {
    this.splashDone();
    this.requestToPermissions()
  };

   requestToPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Music',
          message:
            'App needs access to your Files... ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('startDownload...');
        // this.startDownload();
      }else{
          alert("Permission must be granted for downloads to proceeds ")
      }
    } catch (err) {
      console.log(err);
    }
  };

  splashDone = () => {
    setTimeout(() => {
      this.props.navigation.replace(this.props.isLoggedIn ? 'Root' : 'Signin');
      // this.props.navigation.navigate('Signin');
    }, 1200);
  };

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
  const {isLoggedIn} = state.auth;
  return {isLoggedIn};
};

export default connect(mapStateToProps)(Splash);
