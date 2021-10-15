import {StyleSheet, Dimensions} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashStyle: {
    height: '100%',
    width: Dimensions.get('window').width,
  },
});
export default styles;
