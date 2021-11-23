import {StyleSheet, Dimensions} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import theme from '../../theme'
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '90%',
    // backgroundColor:'green',
    // alignSelf: 'center',
  },
  imgContainer:{
    width:165,
    height:54,
    justifyContent:'center',
    alignSelf:'center',
    top:responsiveHeight(4),
    
  },
  input:{
    borderBottomWidth:1,
    borderBottomColor:theme.colors.primary,
    fontSize:18,
    // fontWeight:'500',
    color:theme.colors.secondary,
    paddingBottom:0,
    fontFamily:'Lato'
  },

  labelstyle:{
    fontSize:18,
    fontWeight:'500',
    fontFamily:'Lato',
    color:theme.colors.primary
  },
  loginbtn:{
    height:48,
    width:'100%',
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
    elevation:20,
    shadowOffset:5
  }
})

export default styles;