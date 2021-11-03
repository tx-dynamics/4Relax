import React, {Component} from 'react';
import {View, StatusBar, ImageBackground,Image, AsyncStorage} from 'react-native';
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
  };
  splashDone = () => {
    setTimeout(() => {
      this.props.navigation.replace(this.props.isLoggedIn ? 'Root' : 'Signin');
      // this.props.navigation.navigate('Signin');
    }, 3000);
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
