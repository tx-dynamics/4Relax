import React from 'react'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import styles from './styles'
import {logo,cover,play,pause} from '../../assets'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'


export default function playing() {
    return (
        <View style={{width:'100%',height:67,borderRadius:15,backgroundColor:'#012229',bottom:7,alignSelf: 'flex-end'}}>
            <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:10,marginLeft:15}]} >Meditate - Defeat your stress</Text>
            <View style={{flexDirection:'row',marginTop:8}}>
                <View style={{flex:2}}>
                    <View style={{width:'90%',height:2,borderColor:'white',backgroundColor:'white',marginLeft:15}}/>
                    <View style={{flexDirection:'row',marginTop:responsiveHeight(0.4),marginLeft:responsiveWidth(4)}}>
                        <View style={{flex:0.94}}>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >00:05</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >05:00</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex:0.25,justifyContent:'center',marginBottom:responsiveHeight(8)}}>
                    <Image 
                        source={pause}
                        style={{width:32,height:32}}
                    />
                </View>
            </View>

        </View>
    )
}
