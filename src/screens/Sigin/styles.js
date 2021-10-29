import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
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
    borderBottomColor:'#CCCCCC',
    fontSize:12,
    fontWeight:'500',
    colors:'#CCCCCC',
    paddingBottom:0,
    fontFamily:'Lato'
  },

  labelstyle:{
    fontSize:18,
    fontWeight:'500',
    fontFamily:'Lato',
    color:'#FFFFFF'
  },
  loginbtn:{
    height:48,
    width:'100%',
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
    // elevation:20,
    // shadowOffset:5
  }
})

export default styles;