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
import {connect} from 'react-redux';
import {togglePlayer} from '../../redux/actions/validate_player';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import * as Animatable from 'react-native-animatable'
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
      
      title: 'Track 1',
      artist:'Relax',
      artwork:require('../../assets/images/m1.png'),
      url: require('../../assets/images/gta.mp3'),
      id: 1,
      // duration:311
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
    alwaysPauseOnInterruption: true,
		waitForBuffer: true,
    capabilities: [
      Capability.SeekTo,
      Capability.Play,
      Capability.Pause,
      Capability.JumpForward, 
      Capability.JumpBackward,
        // Capability.SkipToNext,
        // Capability.SkipToPrevious,
        // Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
        // Capability.JumpForward,
      // Capability.JumpBackward
        // Capability.SkipToNext,
        // Capability.SkipToPrevious,
        // Capability.Stop,
    ],
    icon: require('../../assets/images/feed.png')
  })
//   await TrackPlayer.add(tracks)
}

const updateOptions = async ()=>{
await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward
          // Capability.SkipToNext,
          // Capability.SkipToPrevious,
          // Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
          Capability.Pause,
          // Capability.JumpForward,
        // Capability.JumpBackward
          // Capability.SkipToNext,
          // Capability.SkipToPrevious,
          // Capability.Stop,
      ]
    })
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



function trackbanner  (props)  {

  const playbackState = usePlaybackState()
  const progress = useProgress()
  const [playState,setplayState] = useState('paused') 
  const [playSeconds,setplaySeconds] = useState(0) 
  const [duration,setduration] = useState(0) 
  const [item,setitem] = useState({}) 
  const [trackCategory,settrackCategory] = useState({}) 
  const [connection,setconnection] = useState(false) 
  const [isLoading,setisLoading] = useState(true) 
  const [don,setdon] = useState(false) 
  const [selected,setselected] = useState(false) 
  const [mainPic,setmainPic] = useState('') 
  const [type,settype] = useState('') 
  const [repeatMode,setRepeatMode] = useState('off') 
  const [animate,setanimate] = useState('slideInUp') 

  
  
  useEffect(() => {
    setup();
    // return console.log(props);
    getMain();
    // CheckConnectivity()
    
      // alert(ImagePath)
      // this.setState({mainPic:main})
    return  async () => await TrackPlayer.destroy();
  }, []);

  async function getMain(){
    var data = await AsyncStorage.getItem("single_item")
    setitem(JSON.parse(data))
    var dat = JSON.parse(data)
    NetInfo.fetch().then((state) => {
        // alert(JSON.stringify(state)) 
    // return console.log("track banner here $$$$$$$$$$$$$$$$$$$$$$$$$$$$$",dat.trackFile);

        setconnection(state.isConnected)  
        if(state.isConnected){
            setmedia(dat,state)
        }else{
            setmedia(dat,state)
    
        }    
      });
  }

 
  async function setmedia(audio,state){
    // alert(JSON.stringify(audio.trackCategory.name));
    // return alert(audio.trackFile);
    if(state.isConnected){
        // alert(1)
        await TrackPlayer.add([{
        id: 1,
        url: audio.trackFile,
        title: audio.trackType  ,
        // artist:audio.trackCategory.name,
        // duration:15,
        // artwork:'file://' + main
        // artwork:{uri : 'file://' + mainPic}
      },])
    }else{
    // alert(2)
      await TrackPlayer.add([{
        id: 1,
        url: audio.trackFile,
        title: audio.trackType+" - "+audio.cat_name,
        // artist:audio.cat_name,
        // duration:progress.duration,
        // artwork:audio.trackImage
        // artwork:{uri : 'file://' + audio.coverPic}
      },])
    }
    
    await TrackPlayer.play();
    // setTimeout(() => {

    //   alert(JSON.stringify(progress))
    //   setduration(progress.duration)
    //   setplaySeconds(progress.position)
    // }, 5000);
    setisLoading(false)

  }




  const currentTimeString = getAudioTimeString(progress.position);
  const durationString = getAudioTimeString(progress.duration);
  function getAudioTimeString(seconds){
    // const h = parseInt(seconds/(60*60));
    const m = parseInt(seconds%(60*60)/60);
    const s = parseInt(seconds%60);

    // return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    return ((m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
  }

  async function jumpNext20Seconds  (pos,dur)  {
      let nextSecs = pos + 20 ;
      if(nextSecs < 0) nextSecs = 0;
      else if(nextSecs > dur) nextSecs = dur;
      await TrackPlayer.seekTo(nextSecs)
  }
  async function jumpPrev20Seconds  (pos,dur)  {
      let nextSecs = pos - 20 ;
      if(nextSecs < 0) nextSecs = 0;
      else if(nextSecs > dur) nextSecs = dur;
      // alert(nextSecs)
      await TrackPlayer.seekTo(nextSecs)
  }

  function  getloop (){
    if(repeatMode == 'off'){
      setRepeatMode('track')
      TrackPlayer.setRepeatMode(RepeatMode.Track)
    }else{
      setRepeatMode('off')
      TrackPlayer.setRepeatMode(RepeatMode.Off)
    }
    
  }



  


  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  async function swipedown(){
    if(playbackState === State.Playing){
    }else{
      // alert(1)
      // setanimate('slideInDown')
      await props.togglePlayer(false)
    }
  }

  async function swipeUp(){
    tooglePlayback(playbackState)
    await props.togglePlayer(false)
    props.navigation.navigate('AudiofileStack',{screen:'Track',params:{single:item}})
  }

  return (
    <Animatable.View
      animation={animate}
      duration={500}
      delay={120}
    >
    <GestureRecognizer
        // onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => swipeUp()}
        onSwipeDown={(state) => {
          setanimate('slideInDown')
          swipedown()
        }}
        // onSwipeLeft={(state) => this.onSwipeLeft(state)}
        // onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          // flex: 1,
          // backgroundColor: this.state.backgroundColor
        }}
        >

        <View style={{width:'100%',height:87,borderRadius:15,backgroundColor:'#012229',bottom:responsiveHeight(1.5),alignSelf: 'flex-end'}}>
            {isLoading?
                <ActivityIndicator size={'large'} color={'white'} style={{marginTop:responsiveHeight(3.5),alignSelf:'center',justifyContent:'center'}} />
            :
            <>
            <TouchableOpacity onPress={()=> 
                {
                    // this.pause(),
                    // props.navigation.navigate('AudiofileStack',{screen:'Track',params:{single:item}})
                // this.props.navigation.navigate('AudioPlayer',{single:item})
                }}>
                <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:responsiveHeight(1),marginLeft:responsiveWidth(5)}]} >{item.trackName? item.trackName : item.trackType}</Text>
                {/* <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:10,marginLeft:15}]} >{single.trackName? single.trackName : single.trackType}</Text> */}
            </TouchableOpacity>
            <View style={{flexDirection:'row',marginTop:responsiveHeight(1)}}>
                <View style={{flex:2.5}}>
                    <View style={{flexDirection:'row',marginLeft:responsiveWidth(2.5)}}>
                        <Slider
                           minimumValue={0}
                           maximumValue={progress.duration}
                           onSlidingComplete={async(value)=>{
                             await TrackPlayer.seekTo(value)
                             // await TrackPlayer.reset()
                           }}
                            value={progress.position}  maximumTrackTintColor='#FFFFFF' minimumTrackTintColor='#7497FF'  thumbTintColor='white' 
                            style={{ flex:1,alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:responsiveHeight(0.4),marginLeft:responsiveWidth(5)}}>
                        <View style={{flex:0.95}}>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{getAudioTimeString(progress.position)}</Text>
                        </View>
                        <View style={{}} >
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{getAudioTimeString(progress.duration)}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{tooglePlayback(playbackState)}} style={{flex:1,alignItems:'center',marginTop:-5}}>
                    {playbackState === State.Playing ?
                        <Image source={img_pause} style={{width:32,height:32,marginRight:responsiveWidth(3.4)}}/>
                        : 
                        <Image source={img_play} style={{width:32,height:32,marginRight:responsiveWidth(3.4)}}/>
                    }
                </TouchableOpacity>
                {/* {playbackState === State.Playing  &&
                <TouchableOpacity onPress={()=>this.pause()} style={{flex:0.4,alignItems:'center',justifyContent:'center',marginBottom:responsiveHeight(10)}}>
                    <Image 
                        source={img_pause}
                        style={{width:32,height:32,marginRight:responsiveWidth(3.4)}}
                    />
                </TouchableOpacity>}
                {playbackState === State.Playing  &&
                <TouchableOpacity onPress={()=>this.play()} style={{flex:0.4,alignItems:'center',justifyContent:'center',marginBottom:responsiveHeight(10)}}>
                    <Image 
                        source={img_play}
                        style={{width:32,height:32,marginRight:responsiveWidth(3.3)}}
                    />
                </TouchableOpacity>}                 */}
            </View>

            </>
            }
            
        </View>
    </GestureRecognizer>
    </Animatable.View>
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

// export default trackbanner;
const mapStateToProps = state => {
  const {userData} = state.auth;
  const {val} = state.validatePlayer;
  
  return {
    userData,val
  };
};
export default connect(mapStateToProps, {
  togglePlayer
})(trackbanner);
// import React from 'react'

// export default function trackplayer() {
//     return (
//         <div>
            
//         </div>
//     )
// }

