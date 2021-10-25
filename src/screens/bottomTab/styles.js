import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({

    imgBackground:{
        width:'100%',
        height:200,
        alignItems:'flex-end'
    },
    img:{
        width:69,
        height:23,
        top:104,
        alignSelf:'flex-end',
        right:12
    },
    cate:{
        marginLeft:12,
        marginRight:12,
        width:88,
        height:35,
        borderRadius:19,
        justifyContent:'center',
        alignItems:'center',
},
    iconBackground:{
        width:24,
        height:24,
        borderRadius:25,
        backgroundColor:'rgba(31, 26, 21, 0.56)',
        justifyContent:'center',
},
icon:{
    width:15,
    height:13.5,
    tintColor:'white',
    alignSelf:'center'
},
title:{alignSelf:'center',fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'white'},
select:{fontSize:12,fontWeight:'400',fontFamily:'Lato',color:'#00000',marginLeft:responsiveWidth(1)},
select_container:{
    width:76,
    height:22,
    borderRadius:13,
    backgroundColor:'white',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    bottom:responsiveHeight(1),
    marginLeft:responsiveWidth(1.5)
},
    price:{
        textAlign:'center',
        color:'black',
        fontSize:10,
        fontWeight:'700',
        fontFamily:'Roboto'
    }

})

export default styles;