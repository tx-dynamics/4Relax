import React,{useState,useEffect} from 'react'
import {View,Text,ImageBackground,Image,FlatList, Dimensions} from 'react-native'
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
import {get_allmeditation} from '../../redux/actions/meditation';
import {unloc,pause,play,download,fav,logo,del,cover} from '../../assets'

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
        download:require('../../assets/images/download.png')

    },
    {
        image:require('../../assets/images/m2.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        pause:require('../../assets/images/pause.png'),
        play:require('../../assets/images/play.png'),

    },
    {
        image:require('../../assets/images/m3.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),
        download:require('../../assets/images/download.png')
    },
    {
        image:require('../../assets/images/m4.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        play:require('../../assets/images/play.png'),
        pause:require('../../assets/images/pause.png'),

    },
    {
        image:require('../../assets/images/m5.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        play:require('../../assets/images/play.png'),
        pause:require('../../assets/images/pause.png'),

    },
    {
        image:require('../../assets/images/m1.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),
        download:require('../../assets/images/download.png')

    },
    {
        image:require('../../assets/images/m1.png'),
        favimg:require('../../assets/images/fav.png'),
        delimg:require('../../assets/images/del.png'),
        unloc:require('../../assets/images/lock.png'),
        download:require('../../assets/images/download.png')

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
        getMeditation()
    }, [isFocused])
    
    async function getMeditation() {
        try {
          const res = await props.get_allmeditation();
          console.log('group_data', res);
          if (res?.data) {
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

    return (
        <View style={{flex:1,backgroundColor:'#00303A'}}>
            <ImageBackground
                source={cover}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>MEDITATION</Text>
                <View style={{height:'50%'}} />
                <Image
                    source={logo}
                    style={styles.img}
                />
                <FlatList
                  style={{width:'100%'}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={data}
                  renderItem={({ item, index }) =>
                  <View style={{marginTop:responsiveHeight(1)}}>
                      {item.selected?
                       <LinearGradient
                        colors={['rgba(0, 194, 255, 1)',  'rgba(0, 194, 255, 0.6)']}
                       style={styles.cate}
                       >
                            <TouchableOpacity>
                                <Text style={{color:'black'}}>{item.name}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                      :
                      <TouchableOpacity style={[styles.cate,{backgroundColor:'white'}]}>
                            <Text style={{color:'black',justifyContent:'center'}}>{item.name}</Text>
                        </TouchableOpacity>
                      }
                  </View>
                  }/>
            </ImageBackground>
            {/* <View style={{marginBottom:responsiveHeight(35)}}> */}
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
                                        <TouchableOpacity  style={[styles.iconBackground,{left:16,top:12}]}>
                                            <Image
                                                source={fav}
                                                style={[styles.icon,{
                                                    tintColor: item.liked? '#FF4040' :'white'
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
            {/* </View> */}
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
    get_allmeditation,
  })(feed);
  