import React,{useState} from 'react'
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

export default class PlayerScreen extends React.Component{

    // static navigationOptions = props => ({
    //     title:props.navigation.state.params.title,
    // })

    constructor(){
        super();
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0,
            single:{},
            trackCategory:{},
            connection:false,
            isLoading:true,
            don:false,
            selected:false,
            mainPic:'',
            type:''
        }
        this.sliderEditing = false;
    }

    componentDidMount(){
        // this.props.navigation.addListener(
        //     'willBlur',
        //     payload => {
        //         // this.sound.stop();
        //       // callback when component comes into view
        //       alert('willFocus', payload);
        //     }
        //   );
        this.CheckConnectivity()
        this.getData()
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
                    this.setState({mainPic:item.path})
    
                    // setImage(item.path)
                  // return console.log(files);
                }
                else if(item.name === tracktype){
                    this.setState({mainPic:item.path})
                }
                // alert(tracktype)
                })
              })
            }
          })    
          this.setState({mainPic:main})
        
        
        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    // console.log(seconds)
                    this.setState({playSeconds:seconds});
                })
            }
        }, 1000);
        // this.props.navigation.addListener(
        //     'willBlur' ,() => {
        //         this.sound.stop();
        //     })

    }

    getData(again = ''){
        var id = this.props.route.params.single._id
        var track_id = this.props.route.params.single.trackId
        var fav = this.props.route.params.single
        var type = this.props.route.params.single.type
        var track = this.props.route.params.single.trackType
        var tracktype=track.charAt(0).toUpperCase() + track.slice(1)
        // return console.log(id,track_id)
        this.setState({type:type})
        if(type === 'fav'){
          this.getSingle(again,track_id,fav,type,tracktype);

        }else{
          this.getSingle(again,id,fav,type,tracktype);

        }
        // alert(tracktype)
    }

  
    CheckConnectivity  ()  {
        // For Android devices
        NetInfo.fetch().then((state) => {
          this.setState({connection:state.isConnected})
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected,state.isInternetReachable);
          
        });
      };

    getSingle = async (again,id,fav,type,tracktype) => {
        // alert(again)
        let userId = await AsyncStorage.getItem('userId');
        console.log("***************************",JSON.parse(userId))
        const params = {
            userId :JSON.parse(userId)
        }
        // alert(id)
        if(this.state.connection){
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
                this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                setTimeout(() => {
                    this.play(again)
                }, 500);
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
                    this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                    setTimeout(() => {
                        this.play(again)
                    }, 500);
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
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                console.log(res?.data)
                if(res?.data){
                    this.setState({single:res?.data,trackCategory:res?.data?.trackCategory})
                    setTimeout(() => {
                        this.play(again)
                    }, 500);
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
                this.setState({don:true})
                console.log(fav);
                if(fav){
                    this.setState({single:fav})
                    setTimeout(() => {
                        this.play(again)
                    }, 500);
                }
            
            } catch (err) {
            console.log("error found : "+err);
            }
        }
    }



    componentWillUnmount(){
        // this.didBlurSubscription.remove()
        // alert('called')
        if(this.sound){
            this.sound.release();
            this.sound.stop();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if(this.sound){
            this.sound.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    play = async (again = '') => {
      // alert(again)
      if(again === 'true'){

      }else{
        if(this.sound){
            // alert("good")
            this.sound.play(this.playComplete);
            this.setState({playState:'playing'});
        }else{
            // alert("bad")
            // const filepath = this.props.navigation.state.params.filepath;
            // console.log(filepath)
            // var dirpath = '';
            // if (this.props.navigation.state.params.dirpath) {
            //     dirpath = this.props.navigation.state.params.dirpath;
            // }
            // console.log('[Play]', filepath);
    
            this.sound = new Sound({uri:this.state.single.trackFile}, (error) => {
                // alert("bad")
                
                if (error) {
                    console.log('failed to load the sound', error);
                    Alert.alert('Notice', 'audio file error. (Error code : 1)');
                    this.setState({playState:'paused'});
                }else{
                    // if(this.state.playState === 'paused')
                    this.setState({playState:'playing',isLoading:false, duration:this.sound.getDuration()});
                    this.sound.play(this.playComplete);
                }
            });    
        }
      }
    }
    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({playState:'paused', playSeconds:0});
            this.sound.setCurrentTime(0);
        }
    }

    pause = () => {
        if(this.sound){
            this.sound.pause();
        }

        this.setState({playState:'paused'});
    }

    jumpPrev15Seconds = () => {this.jumpSeconds(-20);}
    jumpNext15Seconds = () => {this.jumpSeconds(20);}
    jumpSeconds = (secsDelta) => {
        if(this.sound){
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({playSeconds:nextSecs});
            })
        }
    }

    getloop (){
        this.setState({selected:!this.state.selected})
        if(this.state.selected){
            this.sound.setNumberOfLoops(0);
        }else{
            this.sound.setNumberOfLoops(-1);
        }
    }

    getAudioTimeString(seconds){
        // const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        // return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
        return ((m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    deletefile = async () => {
        let name = this.state.single.trackName;

        try {
            await AsyncStorage.removeItem(name);
            // alert('cleared item')
            // return true;
        }catch(exception) {
            alert(exception)
              // return false;
          }
        
        //   return
        this.setState({isLoading:true})
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
              
              // console.log(name+"Deleted");
              // Snackbar.show({
              //   text: name+' Deleted',
              //   backgroundColor: '#018CAB',
              //   textColor: 'white',
              // });
          }else{
              console.log("File Not Available")
            //   Snackbar.show({
            //     text: 'File Not Available',
            //     backgroundColor: 'tomato',
            //     textColor: 'white', 
            //   });
          }
  
        
        }catch(e){
          console.log("error : "+e)
        }
        
        if(this.state.single.liked === 'yes'){
            // alert('called')
            this.addRemoveFav(this.state.single)
            this.favourities(this.state.single)
          }

        setTimeout(() => {
            this.props.navigation.goBack()
            this.setState({isLoading:false})
        }, 500);
     
  
      }

    favourities = async (item,track) => {
        this.setofflinefav(item)
    let userId = await AsyncStorage.getItem('userId');
    if(this.state.connection){
        const params = {
        trackId: item._id,
        trackType: item.trackType,
        trackName: item.trackName,
        trackFile:item.trackFile,
        coverPic:track.coverPic,
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
              if(this.state.type === 'fav'){
                this.props.navigation.goBack()
              }else{
                let again = 'true';
                this.getData(again)
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

    async offlineFav(sing){
        // console.log(this.state.single);
        if(this.state.type === 'fav'){
          try{
            if(sing.liked == 'yes'){
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'no';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }else{
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'yes';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }

            this.setofflinefav(sing)

        }catch(e){
            console.log(e);
        }
        setTimeout(() => {
          this.props.navigation.goBack()              
        }, 500);
        }else{
          try{
            if(sing.liked == 'yes'){
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'no';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }else{
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'yes';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }
            this.setofflinefav(sing)

        }catch(e){
            console.log(e);
        }
        }
        try{
            if(sing.liked == 'yes'){
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'no';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }else{
                this.setState(prevState => {
                    let single = Object.assign({}, prevState.single);  // creating copy of state variable jasper
                    single.liked = 'yes';                     // update the name property, assign a new value                 
                    return { single };                                 // return new object jasper object
                  })
            }
            this.setofflinefav(sing)

        }catch(e){
            console.log(e);
        }

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
       
    async setofflinefav(item){
        let name = item.trackName
        var res = await AsyncStorage.getItem(name)
        var rep = JSON.parse(res)
        if(rep.liked == 'yes'){
            this.addRemoveFav(item)

            rep = ({...rep,liked : 'no'})
        }else{
            this.addRemoveFav(item)

            rep = ({...rep,liked : 'yes'})
        }
        console.log(rep.liked);
        await AsyncStorage.setItem(name,JSON.stringify(rep))
    }

    async  addRemoveFav(post,track){
        // return alert(post.trackType)
        if(post.liked != 'yes'){
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

      set_CatCurrent = async () =>{
        this.props.navigation.goBack()
        // return alert(this.state.single.cat_name)
        // try{
        //   await AsyncStorage.setItem("currentCat",this.state.trackCategory.name ? this.state.trackCategory.name : this.state.single.cat_name)
        //   this.props.navigation.replace("Root",{screen:"Home"})
        // }catch(e){
        //   alert(e)
        // }
      }

    render(){
        const {single,trackCategory,selected,mainPic,connection} = this.state
        // console.log(single.trackCategory);
        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

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
        )
    }
}
