import React, {useEffect,useState} from 'react';
import TrackPlayer,{
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents
} from 'react-native-track-player';
import {View,Text,ImageBackground,Image,FlatList, Dimensions, ActivityIndicator} from 'react-native'
import {logo,shuffle,bg,left,pause,play,del} from '../../assets'
import Slider from '@react-native-community/slider';
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
import Sound from 'react-native-sound';
import axios from 'axios';
import {BASE_URL} from '../../redux/base-url';
import NetInfo from "@react-native-community/netinfo";
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const img_speaker = require('./resources/ui_speaker.png');

const fav = require('../../assets/images/fav.png');
const sound_test = require('../../assets/images/gta.mp3');
const img_pause = require('../../assets/images/pause.png');
const img_play = require('../../assets/images/play.png');
const img_playjumpleft = require('../../assets/images/backward.png');
const img_playjumpright = require('../../assets/images/forward.png');
const sliderEditing = false;
import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');

const tracks = [
  {
    id: 1,
    url: require('../../assets/images/gta.mp3'),
    title: 'Track 1',
    artist:'Relax',
    artwork:require('../../assets/images/m1.png')
  },
  {
    id: 2,
    url: require('../../assets/images/gta.mp3'),
    title: 'Track 2',
    artist:'Calm',
    artwork:require('../../assets/images/m2.png')
  },
];

const setup = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
        Capability.Pause,
        // Capability.SkipToNext,
        // Capability.SkipToPrevious,
        Capability.Stop,
    ]
  })
  await TrackPlayer.add(tracks)
}

const tooglePlayback = async (playbackstate)=>{
  const current = await TrackPlayer.getCurrentTrack();

  if (current != null){
    if(playbackstate === State.Paused){
      await TrackPlayer.play();
    }else{
      await TrackPlayer.pause()
    }
  }
}

// TrackPlayer.updateOptions({
//   stopWithApp: false,
//   capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
//   compactCapabilities: [
//     TrackPlayer.CAPABILITY_PLAY,
//     TrackPlayer.CAPABILITY_PAUSE,
//   ],
// });

function track  ()  {

  const playbackState = usePlaybackState()
  const [playState,setplayState] = useState('paused') 
  const [playSeconds,setplaySeconds] = useState(0) 
  const [single,setsingle] = ({}) 
  const [trackCategory,settrackCategory] = ({}) 
  const [connection,setconnection] = (false) 
  const [isLoading,setisLoading] = (true) 
  const [don,setdon] = (false) 
  const [selected,setselected] = (false) 
  const [mainPic,setmainPic] = ('') 
  const [type,settype] = ('') 
  
  // const setUpTrackPlayer = async () => {
  //   try {
  //     await TrackPlayer.setupPlayer();
  //     await TrackPlayer.add(tracks);
  //     console.log('Tracks added');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    setup();
    CheckConnectivity()
    getData()
    var main = this.props.route.params.single.coverPic
    var type = this.props.route.params.single.type
    var track = this.props.route.params.single.trackType
    var tracktype=track.charAt(0).toUpperCase() + track.slice(1)
    
    // console.log(id)
  
    let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'

    RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(Imgdir).then(files => {
            files.map((item)=>{
              if(item.name === type){
                // ImagePath = item.path
                // alert(1)
                setmainPic(item.path)
                // this.setState({mainPic:item.path})

                // setImage(item.path)
              // return console.log(files);
            }
            else if(item.name === tracktype){
              setmainPic(item.path)
                // this.setState({mainPic:item.path})
            }
            // alert(tracktype)
            })
          })
        }
      })    
      setmainPic(main)

      // this.setState({mainPic:main})
    // return () => getBack()
  }, []);

  function getData (again = ''){
    var id = this.props.route.params.single._id
    var track_id = this.props.route.params.single.trackId
    var fav = this.props.route.params.single
    var type = this.props.route.params.single.type
    var track = this.props.route.params.single.trackType
    var tracktype=track.charAt(0).toUpperCase() + track.slice(1)
    // return console.log(id,track_id)
    this.setState({type:type})
    if(type === 'fav'){
      getSingle(again,track_id,fav,type,tracktype);

    }else{
      getSingle(again,id,fav,type,tracktype);

    }
    // alert(tracktype)
}


function CheckConnectivity  ()  {
      // For Android devices
      NetInfo.fetch().then((state) => {
        setconnection(state.isConnected)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected,state.isInternetReachable);
        
      });
  };

  const getSingle = async (again,id,fav,type,tracktype) => {
    // alert(again)
    let userId = await AsyncStorage.getItem('userId');
    console.log("***************************",JSON.parse(userId))
    const params = {
        userId :JSON.parse(userId)
    }
    // alert(id)
    if(connection){
    if(tracktype === 'Meditation'){
        // alert('meditation')
    try {
        // alert(id)
        // console.log("***************************************88");

            // console.log(params)
        const res = await axios.post(`${BASE_URL}api/relax/meditation/getSingle/${id}`,(params), {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // console.log(res?.data)
        if(res?.data){
          setsingle(res?.data)
          settrackCategory(res?.data?.trackCategory)
            // this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
            // setTimeout(() => {
            //     this.play(again)
            // }, 500);
        }
      } catch (err) {
        console.log("error found : "+err);
      }
    }else if(tracktype === 'Sounds'){
        try {
                // alert('Sounds')
            const res = await axios.post(`${BASE_URL}api/relax/sounds/getSingle/${id}`,(params), {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
            });
            // console.log(res?.data)
            if(res?.data){
              setsingle(res?.data)
              settrackCategory(res?.data?.trackCategory)
                // this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                // setTimeout(() => {
                //     this.play(again)
                // }, 500);
            }
            } catch (err) {
            console.log("error found : "+err);
            }
    }else if(tracktype === 'Stories'){
        try {
            console.log("***************************************88");

            // console.log(params)
                // alert('stories')
            const res = await axios.post(`${BASE_URL}api/relax/stories/getSingle/${id}`,(params), {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
            });
            // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            // console.log(res?.data)
            if(res?.data){
              setsingle(res?.data)
              settrackCategory(res?.data?.trackCategory)
                // this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                // setTimeout(() => {
                //     this.play(again)
                // }, 500);
            }
            } catch (err) {
            console.log("error found : "+err);
            }
    }
    // else if(tracktype){
    //     try {
    //             console.log("fav calling============>",fav);
    //             if(fav){
    //                 this.setState({single:fav})
    //                 setTimeout(() => {
    //                     this.play()
    //                 }, 500);
    //             }
    //         // const res = await axios.get(`${BASE_URL}api/relax/sounds/getSingle/${id}`, {
    //         //     headers: {
    //         //     Accept: 'application/json',
    //         //     'Content-Type': 'application/json',
    //         //     },
    //         // });
    //         // // console.log(res?.data)
    //         // if(res?.data){
    //         //     this.setState({single:res?.data})
    //         //     setTimeout(() => {
    //         //         this.play()
    //         //     }, 500);
    //         // }
    //         } catch (err) {
    //         console.log("error found : "+err);
    //         }
    // }
    else{
        alert('not found')

    }
    }else{
        try {
            // alert('fav : '+tracktype)
            setdon(true)   
            // this.setState({don:true})
            console.log(fav);
            if(fav){
              setsingle(fav)
              // settrackCategory(res?.data?.trackCategory)
                // this.setState({single:fav})
                // setTimeout(() => {
                //     this.play(again)
                // }, 500);
            }
        
        } catch (err) {
        console.log("error found : "+err);
        }
    }
}



  return (
    <View style={{flex:1,backgroundColor:'#00303A'}}>
                
        <ImageBackground
          source={{uri:'file://' + mainPic }} 
              // this.state.don?
              //     'file://' + single.coverPic
              // :
              // this.state.connection?
              //     trackCategory.coverPic ? trackCategory.coverPic : single.coverPic 
              //     :
              //     'file://' + single.coverPic}}
          
          style={[styles.imgBackground,{height:'100%',alignItems:'center'}]}
      >
      <View style={{
              height: '100%',
              width:'100%',
              backgroundColor: '#00000080',
          }} >
              <View style={{width:'90%',alignSelf:'center',alignItems:'center',flexDirection:'row',marginTop:responsiveHeight(3.5)}} >
                  <View style={{flex:0.98}}>
                      <TouchableOpacity onPress={()=> this.set_CatCurrent()}>
                          <Image
                              source={left}
                              style={{width:7,height:14}}
                          />
                      </TouchableOpacity>
                      
                  </View>
                  
                  <TouchableOpacity onPress={()=>this.deletefile()} style={{width:32,height:32,borderRadius:50,backgroundColor:'rgba(31, 26, 21, 0.56)',alignItems:'center'}} >
                      <Image
                          source={del}
                          style={{width:16,height:16,alignSelf:'center',marginTop:responsiveHeight(1)}}
                      />
                  </TouchableOpacity>
              </View>
              <View style={{alignItems:'center',marginTop:responsiveHeight(6)}} >
                  {this.state.connection?
                      <Text style={{fontSize:16,fontWeight:'400',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackType} - {trackCategory.name ? trackCategory.name : single.cat_name}  </Text>
                  :
                      <Text style={{fontSize:16,fontWeight:'400',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackType} - {single.cat_name}  </Text>
                  }
                  <Text style={{fontSize:18,fontWeight:'500',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackName? single.trackName : single.trackType}</Text>
              </View>
              
              {this.state.isLoading?
                  <View style={{alignItems:'center',justifyContent:'center',flex:1}} >
                      <ActivityIndicator style={{alignSelf:'center'}} size={'large'} color={'white'} />
                  </View>
              :
                  <>
                      <View style={{marginTop:responsiveHeight(50)}}>
                      <View style={{flexDirection:'row',flex:1,marginVertical:15}}>
                          <Slider
                              onTouchStart={this.onSliderEditStart}
                              // onTouchMove={() => console.log('onTouchMove')}
                              onTouchEnd={this.onSliderEditEnd}
                              // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                              // onTouchCancel={() => console.log('onTouchCancel')}
                              onValueChange={this.onSliderEditing}
                              value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
                              style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                      </View>
                      <View style={{flexDirection:'row'}}>
                          <View style={{flex:0.96,marginLeft:responsiveWidth(3.2)}}>
                              <Text style={{color:'white'}}>{currentTimeString}</Text>
                          </View>
                          <View>
                              <Text style={{color:'white', alignSelf:'center'}}>{durationString}</Text>
                          </View>
                      </View>
                      
                      </View>
                      <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center',marginTop:responsiveHeight(3.5)}}>
                      <View style={{flex:0.17}} >
                          {/* {single.trackName? */}
                          {/* <Text>{single.liked}</Text> */}
                          <TouchableOpacity onPress={()=> connection? this.favourities(single,trackCategory) : this.offlineFav(single,trackCategory) } style={{height:25,width:25,justifyContent:'center',alignSelf:'center'}} >
                              <Image
                                  source={fav}
                                  style={{width:20,height:18,alignSelf:'center',  tintColor:single.liked === 'no'? 'white' :'#FF4040'}}
                              />
                          </TouchableOpacity>

                          {/* // :
                          // <Image
                          //     source={fav}
                          //     style={{width:20,height:18,alignSelf:'center',  tintColor:'#FF5959'}}
                          // />
                          } */}
                          
                      </View>
                      <View style={{flex:0.8,flexDirection:'row', justifyContent:'space-around',alignItems:'center'}} >
                          <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{}}>
                              <Image source={img_playjumpleft} style={{width:20.5, height:25.5}}/>
                              <View style={{position:'absolute',top:responsiveHeight(1.5),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                  <Text style={{textAlign:'center' ,color:'white', fontSize:5.5}}>20</Text>
                              </View>
                          </TouchableOpacity> 
                          {this.state.playState == 'playing' && 
                          <TouchableOpacity onPress={this.pause} style={{marginHorizontal:20}}>
                              <Image source={img_pause} style={{width:42.88, height:42.99}}/>
                          </TouchableOpacity>}
                          {this.state.playState == 'paused' && 
                          <TouchableOpacity onPress={this.play} style={{marginHorizontal:20}}>
                              <Image source={img_play} style={{width:42.88, height:42.88}}/>
                          </TouchableOpacity>}
                          <TouchableOpacity onPress={this.jumpNext15Seconds} style={{}}>
                              <Image source={img_playjumpright} style={{width:20, height:25}}/>
                              <View style={{position:'absolute',top:responsiveHeight(1.5),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                  <Text style={{textAlign:'center' , color:'white', fontSize:5.5}}>20</Text>
                              </View>
                          </TouchableOpacity>
                      </View>
                      <View style={{flex:0.15}} >
                          {selected?
                          <TouchableOpacity onPress={()=>this.getloop()}>
                              <Image
                                  source={shuffle}
                                  style={{width:19,height:17,alignSelf:'center',tintColor:'#007FFF'}}
                              />
                          </TouchableOpacity> 
                          :
                          <TouchableOpacity onPress={()=>this.getloop()}>
                              <Image
                                  source={shuffle}
                                  style={{width:19,height:17,alignSelf:'center'}}
                              />
                          </TouchableOpacity>
                              
                          }
                          
                      </View>
                      </View>
                  </>
              }
      </View>
      </ImageBackground>
      

    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   btn: {
//     backgroundColor: '#ff0044',
//     padding: 15,
//     borderRadius: 10,
//     margin: 10,
//     width: 160,
//   },
//   text: {
//     fontSize: 30,
//     color: 'white',
//     textAlign: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
// });

export default track;

// import React from 'react'

// export default function trackplayer() {
//     return (
//         <div>
            
//         </div>
//     )
// }

