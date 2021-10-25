import React,{useState} from 'react'
import {View,Text,ImageBackground,Image,FlatList,Switch} from 'react-native'
import {logo,settin,product,right,contact,notification,share,rate,info} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'


export default function setting(props) {

    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
        style={{flex:1}}>
            <ImageBackground
                source={settin}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>SETTINGS</Text>
                <Image
                    source={logo}
                    style={styles.img}
                />
               
            </ImageBackground>
            <View style={{alignItems:'center',width:'90%',alignSelf:'center'}}>
                <Text style={[styles.title,{fontSize:12,top:12}]} >Version 1.0.1</Text>
                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={{height:52,width:'100%',borderRadius:10,marginTop:responsiveWidth(5),justifyContent:'center'}}
                    >
                    <TouchableOpacity onPress={()=> props.navigation.navigate('Subscription')}  style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={product}
                            style={{width:16,height:16,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%'}} >Subscription</Text>
                        <Image
                            source={right}
                            style={{width:5,height:10}}
                        />
                    </TouchableOpacity>

                </LinearGradient>

                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={{height:52,width:'100%',borderRadius:10,marginTop:responsiveWidth(5),justifyContent:'center'}}
                    >
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:'95%'}}>
                                <Image
                                    source={notification}
                                    style={{width:16,height:16,left:10}}
                                />
                                <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'82%'}} >Norifications</Text>
                            </TouchableOpacity>
                            <View style={{width:'20%'}}>
                                <Switch
                                    trackColor={{ false: "#ffff", true: "#0184A1" }}
                                    thumbColor={isEnabled ? "#f4f3f4" : "#0184A1"}
                                    ios_backgroundColor="#0184A1"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                        </View>
                    </View>

                </LinearGradient>

                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={{height:52,width:'100%',borderRadius:10,marginTop:responsiveWidth(5),justifyContent:'center'}}
                    >
                    <TouchableOpacity onPress={()=> props.navigation.navigate('Downloads')} style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={product}
                            style={{width:16,height:16,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%'}} >Downloads</Text>
                        <Image
                            source={right}
                            style={{width:5,height:10}}
                        />
                    </TouchableOpacity>

                </LinearGradient>

                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={{height:52,width:'100%',borderRadius:10,marginTop:responsiveWidth(5),justifyContent:'center'}}
                    >
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={contact}
                            style={{width:16,height:16,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%'}} >Contact us</Text>
                        <Image
                            source={right}
                            style={{width:5,height:10}}
                        />
                    </TouchableOpacity>

                </LinearGradient>

            </View>

            <View style={{marginTop:responsiveWidth(8),flexDirection:'row',justifyContent:'center'}}>
                <LinearGradient 
                    style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center'}}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                >
                    <TouchableOpacity style={{}}>
                        <Image 
                            source={info}
                            style={{width:13.92,height:21.6}}
                        />
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient 
                    style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:responsiveWidth(6)}}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                >
                    <TouchableOpacity style={{}}>
                        <Image 
                            source={share}
                            style={{width:19.05,height:20.04}}
                        />
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient 
                    style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:responsiveWidth(6)}}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                >
                    <TouchableOpacity style={{}}>
                        <Image 
                            source={rate}
                            style={{width:17.07,height:17.21    }}
                        />
                    </TouchableOpacity>
                </LinearGradient>

            </View>

        </LinearGradient>
    )
}
