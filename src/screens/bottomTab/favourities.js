import React,{useState,useEffect} from 'react'
import {View,Text,ImageBackground,Image,FlatList} from 'react-native'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import Soundplayer from './playing'
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {get_allFAVORITES,set_fav} from '../../redux/actions/favorites';
import {unloc,pause,play,download,fav,logo,del,favpost} from '../../assets'
import Snackbar from 'react-native-snackbar';

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

const feed = (props) => {

    const isFocused = useIsFocused();
    const [selected,setSelected ] =  useState(false)
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [item,setitem ] =  useState()
    const [meditations,setmeditations ] =  useState()

    useEffect(() => {
        getfavorites()
    }, [isFocused])
    
    async function getfavorites() {
        try {
          const res = await props.get_allFAVORITES();
        //   console.log('group_data', res);
          if (res?.data) {
            //   console.log(res?.data)
            setmeditations(res?.data);
          }
        //   setloadingGroup(false);
        } catch (err) {
        //   setloadingGroup(false);
          alert(err);
        }
        // if (props?.all_group_data) {
        //   setgroupDetail(props?.all_group_data[0]);
        // }
      }

    async function  favourities(item){
        const params = {
            trackId: item._id,
            trackType: "meditation",
            trackFile:item.trackFile,
            coverPic:item.coverPic,
            userId:props?.userData?.token
          };
            // console.log(params)
          try {
            const res = await props.set_fav(params);
            // console.log('group_data', res);
            if (res?.data) {
                // console.log(res?.data)
                get_allFAVORITES()
                Snackbar.show({
                    text: res?.data,
                    backgroundColor: '#018CAB',
                    textColor: 'white',
                  });
            //   setmeditations(res?.data);
            }
          //   setloadingGroup(false);
          } catch (err) {
          //   setloadingGroup(false);
            alert(err);
          }
    }

    return (
        <View style={{flex:1,backgroundColor:'#00303A'}}>
            <ImageBackground
                source={favpost}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>FAVORITES</Text>
                <Image
                    source={logo}
                    style={[styles.img,{marginTop:responsiveHeight(15)}]}
                />
                
            </ImageBackground>
            <FlatList
                    style={{width:'100%'}}
                    numColumns={'2'}
                    showsVerticalScrollIndicator={false}
                    data={meditations}
                    renderItem={({ item, index }) =>
                        <View style={{width:'46.8%',margin:6,alignItems:'center'}}>
                            <ImageBackground
                                source={{uri:item.coverPic}}
                                borderRadius={15}
                                style={{width:'100%',height:178}}
                            >
                                <View style={{flexDirection:'row',flex:0.3}}>
                                    <View style={{flex:0.29}}>
                                        <TouchableOpacity style={[styles.iconBackground,{left:16,top:12}]}>
                                            <Image
                                                source={fav}
                                                style={[styles.icon,{
                                                    tintColor: item.liked === 'no'? 'white' :'#FF4040'
                                                }]}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex:0.8,alignItems:'flex-end'}}>
                                        <TouchableOpacity  style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                            <Image
                                                source={del}
                                                style={styles.icon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex:0.4}}></View>
                                <View style={{flex:0.3,width:'100%',alignItems:'center'}} >
                                {item.unloc?
                                <>
                                    {!islock?
                                        <TouchableOpacity onPress={()=> setislock(!islock)}  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                            <Image
                                                source={unloc}
                                                style={[styles.icon,{width:15,height:19}]}
                                            />
                                        </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={()=> setislock(!islock)} style={{justifyContent:'center',top:5}}  >
                                        <Image
                                            source={download}
                                            style={[styles.icon,{width:34,height:34,}]}
                                        />
                                    </TouchableOpacity>
                                    }
                                </>
                                    
                                :
                                // <>
                                //     {item.play?
                                    <>
                                        {!isplaying?
                                            <TouchableOpacity onPress={()=> {
                                                setitem(item)
                                                setisplaying(!isplaying)
                                                }}
                                                style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                <Image
                                                    source={play}
                                                    style={[styles.icon,{width:22,height:22}]}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={()=> setisplaying(!isplaying)} style={[styles.iconBackground,{width:34,height:34,top:5,}]}>
                                                <Image
                                                    source={pause}
                                                    style={[styles.icon,{width:22.67,height:22.67}]}
                                                />
                                            </TouchableOpacity>
                                        }
                                    </>
                                
                                // </>
                                }
                                    
                                </View>
                            </ImageBackground>
                        </View>
                    }
                />
            {isplaying?
                <Soundplayer single={item} onPres={()=>props.navigation.navigate('AudioPlayer')} />
                :
            null}   
        </View>
    )
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    
    return {
      userData,
    };
  };
  export default connect(mapStateToProps, {
    get_allFAVORITES,set_fav
  })(feed);
  