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
  // await TrackPlayer.add(tracks)
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



function track  (props)  {

  const playbackState = usePlaybackState()
  const progress = useProgress()
  const [playState,setplayState] = useState('paused') 
  const [playSeconds,setplaySeconds] = useState(0) 
  const [duration,setduration] = useState(0) 
  const [single,setsingle] = useState({}) 
  const [trackCategory,settrackCategory] = useState({}) 
  const [connection,setconnection] = useState(false) 
  const [isLoading,setisLoading] = useState(true) 
  const [don,setdon] = useState(false) 
  const [selected,setselected] = useState(false) 
  const [mainPic,setmainPic] = useState('') 
  const [type,settype] = useState('') 
  const [repeatMode,setRepeatMode] = useState('off') 

  
  
  useEffect(() => {
    setup();
    getMain();
    // CheckConnectivity()
    
      // alert(ImagePath)
      // this.setState({mainPic:main})
    return  async () => await TrackPlayer.destroy();
  }, []);

  function getMain(){
    var main = props.route.params.single.coverPic
    var type = props.route.params.single.type
    var track = props.route.params.single.trackType
    var tracktype=track.charAt(0).toUpperCase() + track.slice(1)
    var ImagePath = '' ;
    // console.log(id)
  
    let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'

    RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(Imgdir).then(files => {
            files.map((item)=>{
              if(item.name === type){
                // alert(1)
                ImagePath = item.path
                // alert(imagePath)
                setmainPic(item.path)
                // this.setState({mainPic:item.path})

                // setImage(item.path)
              // return console.log(files);
            }
            else if(item.name === tracktype){
              // alert(2)

              ImagePath = item.path
              setmainPic(item.path)
                // this.setState({mainPic:item.path})
            }
            // alert(tracktype)
            })
          })
        }
      })    
      setmainPic(main)
      setTimeout(() => {
        let again = ''
        getData(again,ImagePath)
        // alert(main)        
      }, 500);
  }

  function getData (again = '',main){
    var id = props.route.params.single._id
    var track_id = props.route.params.single.trackId
    var fav = props.route.params.single
    var type = props.route.params.single.type
    var track = props.route.params.single.trackType
    var tracktype=track.charAt(0).toUpperCase() + track.slice(1)
    // return console.log(id,track_id)
    settype(type)
    NetInfo.fetch().then((state) => {
      // alert(JSON.stringify(state)) 
      setconnection(state.isConnected)  
      if(type === 'fav'){
        getSingle(again,state,track_id,fav,type,tracktype,main);
      }else{
        getSingle(again,state,id,fav,type,tracktype,main);
  
      }    
    });
    // this.setState({type:type})
    
    // alert(tracktype)
}

  async function setmedia(audio,state,main){
    // return alert(progress.duration);
    if(state.isConnected){
      await TrackPlayer.add([{
        id: 1,
        url: audio.trackFile,
        title: audio.trackType +" - "+audio.trackCategory.name ,
        // artist:audio.trackCategory.name,
        // duration:15,
        artwork:'file://' + main
        // artwork:{uri : 'file://' + mainPic}
      },])
    }else{
      await TrackPlayer.add([{
        id: 1,
        url: audio.trackFile,
        title: audio.trackType+" - "+audio.cat_name,
        // artist:audio.cat_name,
        duration:progress.duration,
        // artwork:audio.trackImage
        artwork:{uri : 'file://' + audio.coverPic}
      },])
    }
    
    await TrackPlayer.play();
    // setTimeout(() => {
    //   alert(JSON.stringify(progress))
    //   setduration(progress.duration)
    //   setplaySeconds(progress.position)
    // }, 10000);
    setisLoading(false)

  }



  const getSingle = async (again,state,id,fav,type,tracktype,main) => {
    // alert(again)
    let userId = await AsyncStorage.getItem('userId');
    // console.log("***************************",JSON.parse(userId))
    const params = {
        userId :JSON.parse(userId)
    }
    // alert(state.isConnected)
    if(state.isConnected){
      // alert(3)
    if(tracktype === 'Meditation'){
    try {
        const res = await axios.post(`${BASE_URL}api/relax/meditation/getSingle/${id}`,(params), {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // alert(JSON.stringify(res))
        if(res?.data){
          setsingle(res?.data)
          settrackCategory(res?.data?.trackCategory)
          if(again != 'true'){
            setmedia(res?.data,state,main)
          }
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
              if(again != 'true'){
                setmedia(res?.data,state,main)
              }
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
              if(again != 'true'){
                setmedia(res?.data,state,main)
              }
                // this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                // setTimeout(() => {
                //     this.play(again)
                // }, 500);
            }
            } catch (err) {
            console.log("error found : "+err);
            }
    }
   
    else{
        alert('not found')

    }
    }else{
      // alert('else called')
        try {
            // alert('fav : '+tracktype)
            setdon(true)   
            // this.setState({don:true})
            console.log(fav);
            if(fav){
              setsingle(fav)
              if(again != 'true'){
                setmedia(fav,state,main)
              }
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



  async function deletefile () {
    let name = single.trackName;

    try {
        await AsyncStorage.removeItem(name);
        // alert('cleared item')
        // return true;
    }catch(exception) {
        alert(exception)
          // return false;
      }
    
    //   return
    // this.setState({isLoading:true})
    setisLoading(true)
    // let cover = name.concat("_img");
    // return console.log(cover)
    let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + name; 
    // let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + cover;
    try{
      let exists = await RNFS.exists(dir);
      if(exists){
          // exists call delete
          await RNFS.unlink(dir).then(() => {
            // console.log('1 deleted');
            RNFS.scanFile(dir)
              .then(() => {
                // console.log('1 scanned');
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch((err) => {         
              console.log(err);
          });
          
      }else{
          console.log("File Not Available")
      
      }

    
    }catch(e){
      console.log("error : "+e)
    }
    
    if(single.liked === 'yes'){
        // alert('called')
        addRemoveFav(single)
        favourities(single)
      }

    setTimeout(() => {
        props.navigation.goBack()
        setisLoading(false)
        // this.setState({isLoading:false})
    }, 500);


  }

  async function favourities (item,track)  {
    setofflinefav(item)
  let userId = await AsyncStorage.getItem('userId');
  if(connection){
    const params = {
    trackId: item._id,
    trackType: item.trackType,
    trackName: item.trackName,
    trackFile:item.trackFile,
    // coverPic:track.coverPic,
    subscriptionType:item.subscriptionType,
    userId:JSON.parse(userId)
    };
    // return  console.log(params)
    try {
        const res = await axios.post(`${BASE_URL}api/relax/favorites/addToFavorite`,
        JSON.stringify(params),
        {
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        });
        // return console.log(res)
        if (res?.data) {
          if(type === 'fav'){
            props.navigation.goBack()
          }else{
            let again = 'true';
            getData(again)
          }
            // alert(res?.data)
        } 
        return res;
        } catch (err) {
        console.log(err.response.data);
        }

  }else{
    // Snackbar.show({
    // text: 'No Internet Connection! ',
    // backgroundColor: 'tomato',
    // textColor: 'white',
    // });
  }
    
  }

  async function offlineFav(sing){
    // console.log(this.state.single);
    if(type === 'fav'){
      try{
        if(sing.liked == 'yes'){
          setsingle(prevState => ({...prevState, liked : 'no'}) );
        }else{
          setsingle(prevState => ({...prevState, liked : 'yes'}) );
        }

        setofflinefav(sing)

    }catch(e){
        console.log(e);
    }
    setTimeout(() => {
      props.navigation.goBack()              
    }, 500);
    }else{
      // alert(1)
      try{
        if(sing.liked == 'yes'){
          // alert('no called')
          setsingle(prevState => ({...prevState, liked : 'no'}) );
        }else{
          // alert('yes called')
          // let obj = single
          // obj.liked =  'yes'
          // setsingle(obj)
          setsingle(prevState => ({...prevState, liked : 'yes'}) );
          // setsingle(prevState => {
          //       let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
          //       single.liked = 'yes';                     // update the name property, assign a new value                 
          //       return { single };                                 // return new object jasper object
          //     })
        }
        setofflinefav(sing)

    }catch(e){
        console.log(e);
    }
    }

    // try{

    //     if(sing.liked == 'yes'){
    //       let obj = single
    //       obj.liked =  'no'
    //       setsingle(obj)
    //       // setsingle(prevState => ({...prevState, liked : 'no'}) );
    //       // setsingle(prevState => {
    //       //       let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
    //       //       single.liked = 'no';                     // update the name property, assign a new value                 
    //       //       return { single };                                 // return new object jasper object
    //       //     })
    //     }else{
    //       let obj = single
    //       obj.liked =  'yes'
    //       setsingle(obj)
    //       // setsingle(prevState => ({...prevState, liked : 'yes'}) );

    //     //   setsingle(prevState => {

    //     //         let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
    //     //         single.liked = 'yes';                     // update the name property, assign a new value                 
    //     //         return { single };                                 // return new object jasper object
    //     //       })
    //     }
    //     setofflinefav(sing)

    // }catch(e){
    //     console.log(e);
    // }

    // try{
    //   if(sing.liked == 'yes'){
    //     // setofflinefav(sing)
    //     const res = this.state.single.map((item)=>{
    //         // console.log(item.liked)
    //         if(item._id === sing._id){
    //             return {
    //                 ...item,
    //                 liked: 'no',
    //               };
    //         } else {
    //             return {
    //                 ...item,
    //                 // isplaying: false,
    //               };
    //         }
    //     })
    //     // setmeditations(res)
    //     console.log(res);
    //     this.setState({single:res})
    //   }else{
    //     // addRemoveFav(sing)
    //     // setofflinefav(sing)
    //     const res = this.state.single.map((item)=>{
    //         // console.log(item.liked)
    //         if(item._id === sing._id){
    //             return {
    //                 ...item,
    //                 liked: 'yes',
    //               };
    //         } else {
    //             return {
    //                 ...item,
    //                 // isplaying: false,
    //               };
    //         }
    //     })
    //     // setmeditations(res)
    //     console.log(res);
    //     this.setState({single:res})
    //   }
    //     setofflinefav(sing)
    //   // setItemData(sing)
    // }catch(e){
    //   console.log(e);
    // }
  } 
  
  async function setofflinefav(item){
    console.log("set offline fav =====>",item);

    let name = item.trackName
    var res = await AsyncStorage.getItem(name)
    var rep = JSON.parse(res)
    // return alert(JSON.stringify(rep))
    if(rep.liked == 'yes'){
        addRemoveFav(item)

        rep = ({...rep,liked : 'no'})
    }else{
        addRemoveFav(item)

        rep = ({...rep,liked : 'yes'})
    }
    console.log(rep.liked);
    await AsyncStorage.setItem(name,JSON.stringify(rep))
  }

  async function  addRemoveFav(post,track){
  // return alert(post.trackType)
  if(post.liked != 'yes'){
    // alert('no called')
      let dirMed = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
      let dirStor = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
      let dirSou = RNFS.DownloadDirectoryPath + '/FourRelax/sounds'
      let desPath = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
      const favPath = '/storage/emulated/0/Download/FourRelax/favourties'
      let meditation = [];
      var filePath = [];
      var ImagePath = [];
      let local = [];
      if(post.trackType === 'Meditation'){
          RNFetchBlob.fs.isDir(dirMed).then((isDir)=>{
              // return console.log(isDir);
              if(isDir){
                RNFS.readDir(dirMed).then(files => {
                  files.map(async(item)=>{
                    try{
                      RNFetchBlob.fs.isDir(favPath).then(async(isDir)=>{
                        if(isDir){
                          // alert('exists')
                          if(item.name === post.trackName){
                            if (item.path.startsWith('/')) {
                              const url = item.path
                              const uriComponents = url.split('/')
                              const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                              // const destPath =  desPath+fileNameAndExtension
                              // console.log(destPath);
                              const destPath = `${desPath}/${fileNameAndExtension}`
                              console.log(destPath);
                              await RNFS.copyFile(url, destPath)
                            }
                          }
                        }else{
                          RNFetchBlob.fs.mkdir(favPath).then(async()=>{
                            // alert("created")
                            if(item.name === post.trackName){
                              if (item.path.startsWith('/')) {
                                const url = item.path
                                const uriComponents = url.split('/')
                                const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                                // const destPath =  desPath+fileNameAndExtension
                                // console.log(destPath);
                                const destPath = `${desPath}/${fileNameAndExtension}`
                                console.log(destPath);
                                await RNFS.copyFile(url, destPath)
                              }
                            }
                          })
                        }
                      })
                      
                  
                    }catch(e){
                      console.log(e);
                    }
                  })
                })
                  
              }else{
                // Snackbar.show({
                //   text: 'No local data found',
                //   backgroundColor: '#018CAB',
                //   textColor: 'white',
                // });
              
              }
            })
      }
      else if(post.trackType === 'Sounds'){
          RNFetchBlob.fs.isDir(dirSou).then((isDir)=>{
              // return console.log(isDir);
              if(isDir){
                RNFS.readDir(dirSou).then(files => {
                  files.map(async(item)=>{
                    try{
                      RNFetchBlob.fs.isDir(favPath).then(async(isDir)=>{
                        if(isDir){
                          // alert('exists')
                          if(item.name === post.trackName){
                            if (item.path.startsWith('/')) {
                              const url = item.path
                              const uriComponents = url.split('/')
                              const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                              // const destPath =  desPath+fileNameAndExtension
                              // console.log(destPath);
                              const destPath = `${desPath}/${fileNameAndExtension}`
                              console.log(destPath);
                              await RNFS.copyFile(url, destPath)
                            }
                          }
                        }else{
                          RNFetchBlob.fs.mkdir(favPath).then(async()=>{
                            // alert("created")
                            if(item.name === post.trackName){
                              if (item.path.startsWith('/')) {
                                const url = item.path
                                const uriComponents = url.split('/')
                                const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                                // const destPath =  desPath+fileNameAndExtension
                                // console.log(destPath);
                                const destPath = `${desPath}/${fileNameAndExtension}`
                                console.log(destPath);
                                await RNFS.copyFile(url, destPath)
                              }
                            }
                          })
                        }
                      })
                      
                  
                    }catch(e){
                      console.log(e);
                    }
                  })
                })
                  
              }else{
                // Snackbar.show({
                //   text: 'No local data found',
                //   backgroundColor: '#018CAB',
                //   textColor: 'white',
                // });
              
              }
            })
      }
      else{
          RNFetchBlob.fs.isDir(dirStor).then((isDir)=>{
              // return console.log(isDir);
              if(isDir){
                RNFS.readDir(dirStor).then(files => {
                  files.map(async(item)=>{
                    try{
                      RNFetchBlob.fs.isDir(favPath).then(async(isDir)=>{
                        if(isDir){
                          // alert('exists')
                          if(item.name === post.trackName){
                            if (item.path.startsWith('/')) {
                              const url = item.path
                              const uriComponents = url.split('/')
                              const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                              // const destPath =  desPath+fileNameAndExtension
                              // console.log(destPath);
                              const destPath = `${desPath}/${fileNameAndExtension}`
                              console.log(destPath);
                              await RNFS.copyFile(url, destPath)
                            }
                          }
                        }else{
                          RNFetchBlob.fs.mkdir(favPath).then(async()=>{
                            // alert("created")
                            if(item.name === post.trackName){
                              if (item.path.startsWith('/')) {
                                const url = item.path
                                const uriComponents = url.split('/')
                                const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                                // const destPath =  desPath+fileNameAndExtension
                                // console.log(destPath);
                                const destPath = `${desPath}/${fileNameAndExtension}`
                                console.log(destPath);
                                await RNFS.copyFile(url, destPath)
                              }
                            }
                          })
                        }
                      })
                      
                  
                    }catch(e){
                      console.log(e);
                    }
                  })
                })
                  
              }else{
                // Snackbar.show({
                //   text: 'No local data found',
                //   backgroundColor: '#018CAB',
                //   textColor: 'white',
                // });
              
              }
            })
      }
     
  }else{
    // alert('yes called')

    // alert('called',post.trackName)
    let name = post.trackName;
    // let cover = name.concat("_img");
    // return console.log(cover)
    let dir = RNFS.DownloadDirectoryPath + '/FourRelax/favourties/' + name; 
    // let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + cover;
    try{
      let exists = await RNFS.exists(dir);
      if(exists){
          // exists call delete
          await RNFS.unlink(dir).then(() => {
            // console.log('1 deleted');
            RNFS.scanFile(dir)
              .then(() => {
                // console.log('1 scanned');
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch((err) => {         
              console.log(err);
          });
         
      }else{
          console.log("File Not Available")
          // Snackbar.show({
          //   text: 'File Not Available',
          //   backgroundColor: 'tomato',
          //   textColor: 'white', 
          // });
    }

  
  }catch(e){
    console.log("error : "+e)
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
                      <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                          <Image
                              source={left}
                              style={{width:7,height:14}}
                          />
                      </TouchableOpacity>
                      
                  </View>
                  
                  <TouchableOpacity onPress={()=>deletefile()} style={{width:32,height:32,borderRadius:50,backgroundColor:'rgba(31, 26, 21, 0.56)',alignItems:'center'}} >
                      <Image
                          source={del}
                          style={{width:16,height:16,alignSelf:'center',marginTop:responsiveHeight(1)}}
                      />
                  </TouchableOpacity>
              </View>
              <View style={{alignItems:'center',marginTop:responsiveHeight(6)}} >
                  {connection?
                      <Text style={{fontSize:16,fontWeight:'400',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackType} - {trackCategory.name ? trackCategory.name : single.cat_name}  </Text>
                  :
                      <Text style={{fontSize:16,fontWeight:'400',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackType} - {single.cat_name}  </Text>
                  }
                  <Text style={{fontSize:18,fontWeight:'500',fontFamily:'Lato',color:'#CCCCCC'}} >{single.trackName? single.trackName : single.trackType}</Text>
              </View>
              
              {isLoading?
                  <View style={{alignItems:'center',justifyContent:'center',flex:1}} >
                      <ActivityIndicator style={{alignSelf:'center'}} size={'large'} color={'white'} />
                  </View>
              :
                  <>
                      <View style={{marginTop:responsiveHeight(50)}}>
                      <View style={{flexDirection:'row',flex:1,marginVertical:15}}>
                          <Slider
                              style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}
                              minimumValue={0}
                              maximumValue={progress.duration}
                              minimumTrackTintColor="white"
                              maximumTrackTintColor="gray"
                              onSlidingComplete={async(value)=>{
                                await TrackPlayer.seekTo(value)
                                // await TrackPlayer.reset()
                              }}
                              // onTouchStart={onSliderEditStart}
                              // onTouchMove={() => console.log('onTouchMove')}
                              // onTouchEnd={onSliderEditEnd}
                              // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                              // onTouchCancel={() => console.log('onTouchCancel')}
                              // onValueChange={onSliderEditing}
                              value={progress.position}   thumbTintColor='white'

                              // style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}
                              />
                      </View>
                      <View style={{flexDirection:'row'}}>
                          <View style={{flex:0.96,marginLeft:responsiveWidth(3.2)}}>
                              <Text style={{color:'white'}}>{getAudioTimeString(progress.position)}</Text>
                          </View>
                          <View>
                              <Text style={{color:'white', alignSelf:'center'}}>{getAudioTimeString(progress.duration)}</Text>
                          </View>
                      </View>
                      
                      </View>
                      <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center',marginTop:responsiveHeight(3.5)}}>
                      <View style={{flex:0.17}} >
                          {/* {single.trackName? */}
                          {/* <Text>{single.liked}</Text> */}
                          <TouchableOpacity onPress={()=> connection? favourities(single,trackCategory) : offlineFav(single,trackCategory) } style={{height:25,width:25,justifyContent:'center',alignSelf:'center'}} >
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
                          <TouchableOpacity onPress={()=>{ jumpPrev20Seconds(progress.position,progress.duration)}} style={{}}>
                              <Image source={img_playjumpleft} style={{width:20.5, height:25.5}}/>
                              <View style={{position:'absolute',top:responsiveHeight(1.5),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                  <Text style={{textAlign:'center' ,color:'white', fontSize:5.5}}>20</Text>
                              </View>
                          </TouchableOpacity> 
                          <TouchableOpacity onPress={()=>{tooglePlayback(playbackState)}} style={{marginHorizontal:20}}>
                          {playbackState === State.Playing ?
                              <Image source={img_pause} style={{width:42.88, height:42.99}}/>
                              : 
                              <Image source={img_play} style={{width:42.88, height:42.88}}/>
                          }
                          </TouchableOpacity>
                          
                          <TouchableOpacity onPress={()=>{ jumpNext20Seconds(progress.position,progress.duration)}} style={{}}>
                              <Image source={img_playjumpright} style={{width:20, height:25}}/>
                              <View style={{position:'absolute',top:responsiveHeight(1.5),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                  <Text style={{textAlign:'center' , color:'white', fontSize:5.5}}>20</Text>
                              </View>
                          </TouchableOpacity>
                      </View>
                      <View style={{flex:0.15}} >
                          {repeatMode === 'off'?
                            <TouchableOpacity onPress={()=>getloop()}>
                                <Image
                                    source={shuffle}
                                    style={{width:19,height:17,alignSelf:'center'}}
                                />
                            </TouchableOpacity>
                            
                            :
                            <TouchableOpacity onPress={()=>getloop()}>
                                <Image
                                    source={shuffle}
                                    style={{width:19,height:17,alignSelf:'center',tintColor:'#007FFF'}}
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

