import React,{useState} from 'react'
import {View,Text,ImageBackground,Image,FlatList,Switch} from 'react-native'
import {select,option,green,lokc,check,cross,icon} from '../../assets'
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
            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                <Image
                    source={cross}
                    style={{width:16,height:16,margin:20}}
                />
            </TouchableOpacity >
            <Image
                    source={icon}
                    style={{width:165,height:54,alignSelf:'center'}}
                />
            <View style={{marginTop:responsiveHeight(4),width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:18,fontWeight:'500',fontFamily:'Lato'}} >Subscription</Text>
                <View style={{marginTop:responsiveHeight(2),width:57,height:22,borderRadius:13,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontWeight:'500',fontSize:10,fontFamily:'Lato',color:'#000'}} >Monthly</Text>
                </View>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Activation')} >
                    <Text style={{fontSize:12,fontWeight:'500',fontFamily:'Lato',color:'#000',marginTop:responsiveHeight(2.8)}} >Have an activation code?</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:responsiveHeight(3)}}>
                    <Image
                        source={check}
                        style={{width:25,height:25}}
                    />
                    <Text style={{width:178,fontWeight:'400',fontSize:14,marginLeft:responsiveWidth(3)}} >Access to 100+ sleep sounds to clam you down</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:responsiveHeight(3)}}>
                    <Image
                        source={check}
                        style={{width:25,height:25}}
                    />
                    <Text style={{width:178,fontWeight:'400',fontSize:14,marginLeft:responsiveWidth(3)}} >A colllection of sleep stories to help you sleep better</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:responsiveHeight(3)}}>
                    <Image
                        source={check}
                        style={{width:25,height:25}}
                    />
                    <Text style={{width:220,fontWeight:'400',fontSize:14,marginLeft:responsiveWidth(3)}} >100+ guided sleep meditation to reduce anxiety and stres levels</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',marginTop:responsiveHeight(10),alignItems:'center',alignSelf:'center'}} >
                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:107,height:137,borderRadius:10}}>
                    <View>
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Packages')}>
                            <Image
                                source={option}
                                style={{width:18.4,height:4.4,marginTop:responsiveHeight(1.8),marginLeft:responsiveWidth(1.5)}}
                            />
                        </TouchableOpacity>
                        <Text style={{marginLeft:responsiveWidth(1.4),fontWeight:'500',fontFamily:'Lato',fontSize:14,marginTop:responsiveHeight(3)}} >For a month</Text>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.4),alignItems:'center',marginTop:responsiveHeight(2)}}>
                            <Image
                                source={green}
                                style={{width:9.99,height:11,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(1.8)}} >Sounds</Text>
                        </View>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.9),alignItems:'center',marginTop:responsiveHeight(1.2)}}>
                            <Image
                                source={lokc}
                                style={{width:6.72,height:9.67,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(2.5)}} >Meditation</Text>
                        </View>
                    </View>
                    <View style={{width:76,height:22,borderRadius:13,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:responsiveHeight(1.2)}}>
                        <Image
                            source={select}
                            style={{width:9.99,height:11}}
                        />
                        <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',color:'#000',marginLeft:responsiveWidth(1)}} >Selected</Text>
                    </View>
                </LinearGradient>

                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:107,height:137,borderRadius:10,marginLeft:responsiveWidth(2.3)}}>
                    <View>
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Packages')}>
                            <Image
                                source={option}
                                style={{width:18.4,height:4.4,marginTop:responsiveHeight(1.8),marginLeft:responsiveWidth(1.5)}}
                            />
                        </TouchableOpacity>
                        <Text style={{marginLeft:responsiveWidth(1.4),fontWeight:'500',fontFamily:'Lato',fontSize:14,marginTop:responsiveHeight(3)}} >For a year</Text>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.4),alignItems:'center',marginTop:responsiveHeight(2)}}>
                            <Image
                                source={green}
                                style={{width:9.99,height:9.99,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(1.8)}} >Sounds</Text>
                        </View>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.4),alignItems:'center',marginTop:responsiveHeight(1.2)}}>
                            <Image
                                source={green}
                                style={{width:9.99,height:9.99,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(1.8)}} >Meditation</Text>
                        </View>
                    </View>

                </LinearGradient>

                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:107,height:137,borderRadius:10,marginLeft:responsiveWidth(2.3)}}>
                    <View>
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Packages')}>
                            <Image
                                source={option}
                                style={{width:18.4,height:4.4,marginTop:responsiveHeight(1.8),marginLeft:responsiveWidth(1.5)}}
                            />
                        </TouchableOpacity>
                        <Text style={{marginLeft:responsiveWidth(1.4),fontWeight:'500',fontFamily:'Lato',fontSize:14,marginTop:responsiveHeight(3)}} >Lifetime Plan</Text>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.4),alignItems:'center',marginTop:responsiveHeight(2)}}>
                            <Image
                                source={green}
                                style={{width:9.99,height:9.99,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(1.8)}} >Sounds</Text>
                        </View>
                        <View style={{flexDirection:'row',marginLeft:responsiveWidth(1.4),alignItems:'center',marginTop:responsiveHeight(1.2)}}>
                            <Image
                                source={green}
                                style={{width:9.99,height:9.99,alignSelf:'center'}}
                            />
                            <Text style={{fontSize:12,fontWeight:'400',fontFamily:'Lato',marginLeft:responsiveWidth(1.8)}} >Meditation</Text>
                        </View>
                    </View>

                </LinearGradient>

            </View>
            <Text style={{alignSelf:'center',fontFamily:'Lato',fontWeight:'600',fontSize:12,marginTop:responsiveHeight(7.9)}} >Try a week free and then null/month</Text>
        </LinearGradient>
    )
}
