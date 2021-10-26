import React,{useState} from 'react'
import {View,Text,ImageBackground,TouchableOpacity,Image,TextInput,FlatList,Switch} from 'react-native'
import {feed,pause,play,fav,QRcode,left,music,explore} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {Header, FAB} from 'react-native-elements';

import styles from './styles'


export default function downloads(props) {

    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
            style={{flex:1}}>
            <Header
                backgroundColor="transparent"
                containerStyle={{
                alignSelf: 'center',
                // height: ,
                borderBottomWidth: 0,
                // borderBottomColor: '#E1E3E6',
                }}
                leftComponent={
                    <TouchableOpacity style={{width:30,height:30,justifyContent:'center',alignItems:'center'}} onPress={()=> props.navigation.goBack()} >
                        <Image
                            source={left}  
                            style={{width:7,height:14,tintColor:'white'}}
                        />
                    </TouchableOpacity>
                    
                }
                centerComponent={
                    <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >DOWNLOADS</Text>
                }
            />
            
            <View style={{alignItems:'center',width:'90%',alignSelf:'center',marginTop:responsiveHeight(5)}}>
                
                <Text style={[styles.title,{fontSize:14,fontWeight:'500'}]} >Enter the code below or scan QR code</Text>
                <View style={{width:'70%',flexDirection:'row',marginTop:responsiveHeight(3)}}>
                    <View style={styles.code_cont} >
                        <TextInput
                            style={styles.code}
                        />
                    </View>
                    <Text style={{alignSelf:'center'}} >  -  </Text>
                    <View style={styles.code_cont} >
                        <TextInput
                            style={styles.code}
                        />
                    </View>
                    <Text style={{alignSelf:'center'}} >  -  </Text>
                    <View style={styles.code_cont} >
                        <TextInput
                            style={styles.code}
                        />
                    </View>

                </View>

                    <LinearGradient
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                            style={[styles.setting_btn,{marginTop:responsiveHeight(4)}]}
                            >
                        <TouchableOpacity>
                            <Text style={[styles.title,{fontSize:18}]} >Activate</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                <View style={{marginTop:responsiveHeight(10)}}>
                    <Image
                        source={QRcode}
                        style={{width:166.67,height:166.67}}
                    />
                </View>
                <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={[styles.setting_btn,{marginTop:responsiveHeight(4)}]}
                        >
                    <TouchableOpacity>
                        <Text style={[styles.title,{fontSize:18}]} >Press to Scan</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </LinearGradient>
    )
}
