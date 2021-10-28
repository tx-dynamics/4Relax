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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'


export default function setting(props) {

    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
        style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                <Image
                    source={cross}
                    style={{width:16,height:16,margin:20}}
                />
            </TouchableOpacity>
            <Image
                    source={icon}
                    style={{width:165,height:54,alignSelf:'center'}}
                />
            <View style={{marginTop:responsiveHeight(4),width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff',fontFamily:'Lato',alignSelf:'center'}} >Subscribe to 4Relax Premium</Text>
                
                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:'100%',height:84,borderRadius:10,marginTop:responsiveHeight(6)}}>
                    <View style={styles.select_container}>
                        <Image
                            source={select}
                            style={{width:9.99,height:11}}
                        />
                        <Text style={[styles.select,{color:'black'}]} >Selected</Text>
                    </View>
                    <TouchableOpacity style={{flexDirection:'row'}} >
                        <View
                            style={{marginLeft:responsiveWidth(2.5),width:'28%',justifyContent:'center'}}
                        >
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>Free</Text>
                        </View>
                        <View>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Meditations</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>2 Stories</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Sounds</Text>

                        </View>
                        <View></View>
                        
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:'100%',height:84,borderRadius:10,marginTop:responsiveHeight(2)}}>
                    
                    <TouchableOpacity style={{flexDirection:'row',height:84}} >
                        <View
                            style={{marginLeft:responsiveWidth(2.5),width:'28%',justifyContent:'center'}}
                        >
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>Lifetime</Text>
                        </View>
                        <View style={{justifyContent:'center',width:'45%'}}>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Meditations</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>2 Stories</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Sounds</Text>

                        </View>
                        <View style={{justifyContent:'center'}} >
                            <Text style={[styles.price,{color:'#ffff',fontSize:22}]}>29$</Text>
                        <TouchableOpacity style={{width:43,marginTop:responsiveHeight(0.8),height:15,borderRadius:5,backgroundColor:'white',}}>
                            <Text style={styles.price}>Buy</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </TouchableOpacity>
                </LinearGradient>
                

                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:'100%',height:84,borderRadius:10,marginTop:responsiveHeight(2)}}>
                    
                    <TouchableOpacity style={{flexDirection:'row',height:84}} >
                        <View
                            style={{marginLeft:responsiveWidth(2.5),width:'28%',justifyContent:'center'}}
                        >
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>12 Months</Text>
                        </View>
                        <View style={{justifyContent:'center',width:'45%'}}>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Meditations</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>2 Stories</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Sounds</Text>

                        </View>
                        <View style={{justifyContent:'center'}} >
                            <Text style={[styles.price,{color:'#ffff',fontSize:22}]}>39$</Text>
                        <TouchableOpacity style={{width:43,marginTop:responsiveHeight(0.8),height:15,borderRadius:5,backgroundColor:'white',}}>
                            <Text style={styles.price}>Buy</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </TouchableOpacity>
                </LinearGradient>


                <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={{width:'100%',height:84,borderRadius:10,marginTop:responsiveHeight(2)}}>
                    
                    <TouchableOpacity style={{flexDirection:'row',height:84}} >
                        <View
                            style={{marginLeft:responsiveWidth(2.5),width:'28%',justifyContent:'center'}}
                        >
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>12 Months</Text>
                        </View>
                        <View style={{justifyContent:'center',width:'45%'}}>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Meditations</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>2 Stories</Text>
                            <Text style={[styles.select,{fontWeight:'700',fontSize:14,color:'#ffff'}]}>10 Sounds</Text>

                        </View>
                        <View style={{justifyContent:'center'}} >
                            <Text style={[styles.price,{color:'#ffff',fontSize:22}]}>49$</Text>
                        <TouchableOpacity style={{width:43,marginTop:responsiveHeight(0.8),height:15,borderRadius:5,backgroundColor:'white',}}>
                            <Text style={styles.price}>Buy</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={{width:'100%',height:48,borderRadius:10,marginTop:responsiveHeight(6),marginBottom:responsiveHeight(5),justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Activation')}>
                            <Text style={[styles.price,{fontWeight:'500',fontSize:14,color:'#ffff'}]} >I have an activation code</Text>
                        </TouchableOpacity>
                </LinearGradient>                                

            </View>
            </ScrollView>
        </LinearGradient>
    )
}
