import React,{useState} from 'react'
import {View,Text,ImageBackground,Image,FlatList} from 'react-native'
import {logo,favpost} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'

const data =[
    {
        name:'Meditate',
        selected:false
    },
    {
        name:'Sleep',
        selected:true
    },
    {
        name:'Calm',
        selected:false
    },
    {
        name:'Calm Sound',
        selected:false
    },
]

const list = [
    {
        image:require('../../assets/images/m1.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),

    },
    {
        image:require('../../assets/images/m2.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        pause:require('../../assets/images/pause.png')
    },
    {
        image:require('../../assets/images/m3.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        download:require('../../assets/images/download.png')
    },
    {
        image:require('../../assets/images/m4.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        play:require('../../assets/images/play.png'),
    },
    {
        image:require('../../assets/images/m5.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        play:require('../../assets/images/play.png'),
    },
    {
        image:require('../../assets/images/m1.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),
    },
    {
        image:require('../../assets/images/m1.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),
    }
]

export default function feed() {

    const [selected,setSelected ] =  useState(false)

    return (
        <View style={{flex:1,backgroundColor:'#00303A'}}>
            <ImageBackground
                source={favpost}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>FAVORITES</Text>
                <Image
                    source={logo}
                    style={styles.img}
                />
                
            </ImageBackground>
            <FlatList
                style={{width:'100%'}}
                numColumns={'2'}
                showsVerticalScrollIndicator={false}
                data={list}
                renderItem={({ item, index }) =>
                    <View style={{margin:6,alignItems:'center'}}>
                        <ImageBackground
                            source={item.image}
                            borderRadius={15}
                            style={{width:190,height:178}}
                        >
                            <View style={{flexDirection:'row',flex:0.3}}>
                                <View style={{flex:0.29}}>
                                    <TouchableOpacity  style={[styles.iconBackground,{left:16,top:12}]}>
                                        <Image
                                            source={item.favimg}
                                            style={[styles.icon,{tintColor:'#FF4040'}]}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:0.8,alignItems:'flex-end'}}>
                                    <TouchableOpacity  style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                        <Image
                                            source={item.delimg}
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex:0.4}}></View>
                            <View style={{flex:0.3,width:'100%',alignItems:'center'}} >
                            {item.unloc?
                                <TouchableOpacity  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                    <Image
                                        source={item.unloc}
                                        style={[styles.icon,{width:15,height:19}]}
                                    />
                                </TouchableOpacity>
                            :
                            <>
                                {item.play?
                                    <TouchableOpacity  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                        <Image
                                            source={item.play}
                                            style={[styles.icon,{width:22,height:22}]}
                                        />
                                    </TouchableOpacity>
                                :
                                <>
                                {item.pause?
                                    <TouchableOpacity  style={[styles.iconBackground,{width:34,height:34,top:5,}]}>
                                        <Image
                                            source={item.pause}
                                            style={[styles.icon,{width:22.67,height:22.67}]}
                                        />
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity style={{justifyContent:'center',top:5}}  >
                                        <Image
                                            source={item.download}
                                            style={[styles.icon,{width:34,height:34,}]}
                                        />
                                    </TouchableOpacity>
                                }
                                </>
                                }
                            </>
                            }
                                
                            </View>
                        </ImageBackground>
                    </View>
                }
            />

        </View>
    )
}
