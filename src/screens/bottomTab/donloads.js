import React,{useState} from 'react'
import {View,Text,ImageBackground,Image,FlatList,Switch} from 'react-native'
import {feed,pause,play,fav,del,left,music,explore} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
            <View style={{alignItems:'center',width:'90%',alignSelf:'center',marginTop:responsiveHeight(1)}}>
            <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={styles.setting_btn}
                    >
                    <View   style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={feed}
                            style={{width:21,height:19,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'55%'}} >Meditate</Text>
                        <TouchableOpacity>
                            <Image
                                source={pause}
                                style={{width:19,height:19,marginLeft:responsiveWidth(5)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={fav}
                                style={{width:19,height:18,tintColor:'#FF4040',marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={del}
                                style={{width:17,height:18,marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                    </View>

            </LinearGradient>

            <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={styles.setting_btn}
                    >
                    <View   style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={explore}
                            style={{width:21,height:19,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'55%'}} >Meditate</Text>
                        <TouchableOpacity>
                            <Image
                                source={play}
                                style={{width:19,height:19,marginLeft:responsiveWidth(5)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={fav}
                                style={{width:19,height:18,marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={del}
                                style={{width:17,height:18,marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                    </View>

            </LinearGradient>


            <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={styles.setting_btn}
                    >
                    <View  style={{flexDirection:'row',alignItems:'center'}}>
                        <Image
                            source={music}
                            style={{width:11,height:24,left:10}}
                        />
                        <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',marginLeft:responsiveWidth(7),width:'55%'}} >Meditatate</Text>
                        <TouchableOpacity>
                            <Image
                                source={play}
                                style={{width:19,height:19,marginLeft:responsiveWidth(1)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={fav}
                                style={{width:19,height:18,marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image
                                source={del}
                                style={{width:17,height:18,marginLeft:responsiveWidth(5.5)}}
                            />
                        </TouchableOpacity>
                    </View>

            </LinearGradient>

            </View>
        </LinearGradient>
    )
}
