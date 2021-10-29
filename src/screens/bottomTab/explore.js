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
import {useIsFocused} from '@react-navigation/native';
import {get_allStories,set_fav} from '../../redux/actions/stories';
import {connect} from 'react-redux';
import {unloc,pause,play,download,fav,logo,del,stories} from '../../assets'
import Soundplayer from './playing'
import Snackbar from 'react-native-snackbar';

const data =[
    {
        id:0,
        name:'Meditate',
        selected:false
    },
    {
        id:1,
        name:'sleep',
        selected:true
    },
    {
        id:2,
        name:'Calm',
        selected:false
    },
    {
        id:3,
        name:'Calm Sound',
        selected:false
    },
]


    const story = (props) => {

    const [selected,setSelected ] =  useState(false);
    const [isplaying,setisplaying ] =  useState(false);
    const isFocused = useIsFocused();
    const [item,setitem ] =  useState();
    const [meditations,setmeditations ] =  useState();
    const [category,setcategory ] =  useState(data)

    useEffect(() => {
        getStories()
    }, [isFocused])
    
    async function getStories(cate = '') {
        try {
          const res = await props.get_allStories();
        //   console.log('group_data', res);
          if (res?.data) {
            if(cate === ''){
              setmeditations(res?.data)
            }else{
              //   alert('calling cate')
              setmeditations()

              var filtered = []; 
              res?.data.map((item)=>{
                  filtered.push(item)
              })
             
              var getFilter = [];

              filtered.map((item)=>{
                  if(item.trackCategory === cate){
                      getFilter.push(item);
                  }else{
                      setmeditations()
                  }
              })
              setmeditations(getFilter)
            }
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
                console.log(res?.data)
                getStories()
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

    async function getcate(item,id){
        console.log(item.selected)
        if(item.selected){
            // alert('called if')
                const    res = category.map((item) => {
                if (item.id === id) {
                  // console.log('Item-image==>',item.loadimage)
                  return {
                    ...item,
                    selected: false,
                  };
                } else {
                  return {
                    ...item,
                    // loadimage: false,
                  };
                }
              });
              setcategory(res);

            }else{
            const res = category.map((item) => {
                if (item.id === id) {
                  // console.log('Item-image==>',item.loadimage)
                //   alert(item.name)
                getStories(item.name)
                  return {
                    ...item,
                    selected: true,
                  };
                } else {
                  return {
                    ...item,
                    selected: false,
                  };
                }
              });
          setcategory(res);

        }
        
      
    }

    return (
        <View style={{flex:1,backgroundColor:'#00303A'}}>
            <ImageBackground
                source={stories}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>STORIES</Text>
                <View style={{height:'50%'}} />
                <Image
                    source={logo}
                    style={styles.img}
                />
                <FlatList
                  style={{width:'100%'}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={category}
                  renderItem={({ item, index }) =>
                  <View style={{marginTop:responsiveHeight(1)}}>
                      {item.selected?
                       <LinearGradient
                        colors={['rgba(0, 194, 255, 1)',  'rgba(0, 194, 255, 0.6)']}
                       style={styles.cate}
                       >
                            <TouchableOpacity  onPress={()=> getcate(item,item.id) } >
                                <Text style={{color:'black'}}>{item.name}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                      :
                      <TouchableOpacity  onPress={()=> getcate(item,item.id) } style={[styles.cate,{backgroundColor:'white'}]}>
                            <Text style={{color:'black',justifyContent:'center'}}>{item.name}</Text>
                        </TouchableOpacity>
                      }
                  </View>
                  }/>
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
                                        <TouchableOpacity onPress={()=> favourities(item)}  style={[styles.iconBackground,{left:16,top:12}]}>
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
    get_allStories,set_fav
  })(story);