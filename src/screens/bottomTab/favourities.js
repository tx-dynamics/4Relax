import React,{useState,useEffect} from 'react'
import {View,Text,RefreshControl,PermissionsAndroid,ActivityIndicator,ImageBackground,Image,FlatList} from 'react-native'
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob'


const feed = (props) => {

    const isFocused = useIsFocused();
    const [localMediImage,setMediImage ] =  useState()
    const [localSounImage,setSounImage ] =  useState()
    const [localStorImage,setStorImage ] =  useState()
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [item,setitem ] =  useState()
    const [meditations,setmeditations ] =  useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [connection,setConnect ] =  useState(false)
    const [internal,setInternal ] =  useState([])

    useEffect(() => {
        setisplaying (false)
        CheckConnectivity()
    }, [isFocused])
    
    function CheckConnectivity  ()  {
        setRefreshing(true);
        // For Android devices
        // alert("called")
        NetInfo.fetch().then((state) => {
          setConnect(state.isConnected)
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected,state.isInternetReachable);
        //if (Platform.OS === "android") {
            if (state.isConnected) {
              getFiles(state)
            } else {
              getFiles(state)
              // Snackbar.show({
              //   text: 'You are not Connected to Internet, Continuing Offline!',
              //   backgroundColor: '#018CAB',
              //   textColor: 'white',
              // });
            }
          
        });
      };
  
      function getFiles(state){
        let dir = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
        let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'
        var meditation = [];
        var filePath = [];
        var ImagePath = '';
        let MediImage = '';
        let StoryImage = '';
        let SoundImage = '';

        RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
          if(isDir){
            RNFS.readDir(Imgdir).then(files => {
              files.map((item)=>{
                // console.log(item);
                if(item.name === "Meditation"){
                  MediImage = item.path
                  setMediImage(item.path)
                // return console.log(files);
                }else if(item.name === "Sounds"){
                  SoundImage = item.path
                  setSounImage(item.path)
                }else{
                  StoryImage = item.path
                  setStorImage(item.path)
                }
              })
            })
          }
        })
          // alert(MediImage)
          
        try{
        RNFetchBlob.fs.isDir(dir).then((isDir)=>{
          // return   alert(isDir)
          if(isDir){
            RNFS.readDir(dir).then(files => {
              files.map((item)=>{
                // console.log("at here------------------>",item.path,item.name)  
                // if(item.name.includes("_img")){
                //   ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                // }else{
                  filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
                // }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
              })
              // console.log("at here------------------>",filePath)  

              filePath.map(async(item)=>{
                // ImagePath.map((img)=>{
                // console.log("at here------------------>",item)  
                //   if(item.trackName === img.name){
                  var res = await getLocalJson(MediImage,SoundImage,StoryImage,item,item.trackName,state)
                  // console.log("local===========>",JSON.stringify(res));
                  meditation.push(res)
                    // meditation.push({"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,exists:true})
                //   }
                // })
              })
              // meditation = [{...filePath,...ImagePath}]
              // console.log("????????????????????????????????????????")
              if(state.isConnected){
                // console.log(meditation)
                // alert("called internal medi")
                setTimeout(() => {
                setInternal(meditation)
                getfavorites(meditation)  
                }, 500);
                
      
              }else{
                setTimeout(() => {
                  // console.log("H@R@/////////////////////--->",meditation)
                  setmeditations(meditation)
                  setRefreshing(false);  
                }, 500);
                
              }
      
      
            }).catch(err => {
              setRefreshing(false);
              console.log(err.message, err.code);
            });
          }else{
            // alert("No local data found")
            // Snackbar.show({
            //     text: 'No local data found',
            //     backgroundColor: '#018CAB',
            //     textColor: 'white',
            //   });
            let meditation = []
            getfavorites(meditation)
          }
        })
      }catch(e){console.log(e);}
      }

      async function getLocalJson (mediImg,sounImg,storyImg,item,name,state){
        let meditation = {}
        let obj = await AsyncStorage.getItem(name);
        // return console.log("here=====local json========>",JSON.parse(obj))
        let pared = JSON.parse(obj) 
        // return console.log("here=====local pared json========>",pared)
          // if (pared != null){      
            if(pared.trackType === 'Meditation'){ 
              // alert(pared.trackType) 
              if (pared != null){      
              meditation = ({
                "_id":pared._id,
                "liked":pared.liked,
                "cat_name":pared.trackCategory.name,
                "trackType": pared.trackType,
                "trackFile":item.trackFile,
                "trackName":item.trackName,
                "coverPic":mediImg,
                isdownloading:item.isdownloading,
                isplaying: false,
                exists:true
              })
              }else{
            // if(item.trackName === img.name){  
              meditation = ({
                // "_id":pared._id,
                // "liked":pared.liked,
                // "cat_name":pared.trackCategory.name,
                // "trackType": pared.trackType,
                "trackFile":item.trackFile,
                "trackName":item.trackName,
                "coverPic":mediImg,
                isdownloading:item.isdownloading,
                isplaying: false,
                exists:true
              })
              }
            }else if(pared.trackType === 'Sounds'){
              // alert(pared.trackType) 
              if (pared != null){      
                meditation = ({
                  "_id":pared._id,
                  "liked":pared.liked,
                  "cat_name":pared.trackCategory.name,
                  "trackType": pared.trackType,
                  "trackFile":item.trackFile,
                  "trackName":item.trackName,
                  "coverPic":sounImg,
                  isdownloading:item.isdownloading,
                  isplaying: false,
                  exists:true
                })
                }else{
              // if(item.trackName === img.name){  
                meditation = ({
                  // "_id":pared._id,
                  // "liked":pared.liked,
                  // "cat_name":pared.trackCategory.name,
                  // "trackType": pared.trackType,
                  "trackFile":item.trackFile,
                  "trackName":item.trackName,
                  "coverPic":sounImg,
                  isdownloading:item.isdownloading,
                  isplaying: false,
                  exists:true
                })
                }
            }else{
              // alert(pared.trackType) 
              if (pared != null){      
                meditation = ({
                  "_id":pared._id,
                  "liked":pared.liked,
                  "cat_name":pared.trackCategory.name,
                  "trackType": pared.trackType,
                  "trackFile":item.trackFile,
                  "trackName":item.trackName,
                  "coverPic":storyImg,
                  isdownloading:item.isdownloading,
                  isplaying: false,
                  exists:true
                })
                }else{
              // if(item.trackName === img.name){  
                meditation = ({
                  // "_id":pared._id,
                  // "liked":pared.liked,
                  // "cat_name":pared.trackCategory.name,
                  // "trackType": pared.trackType,
                  "trackFile":item.trackFile,
                  "trackName":item.trackName,
                  "coverPic":storyImg,
                  isdownloading:item.isdownloading,
                  isplaying: false,
                  exists:true
                })
                }
          }
        // }
            return meditation
      
        if(state.isConnected){
          // alert("called internal medi")
          setInternal(meditation)
          let cate = cat;
          let cover = '';
          getMeditation(cate,cover,meditation)
  
        }else{
          console.log("called====>========>",meditation)
          // console.log(meditation)
          setmeditations(meditation)
          setRefreshing(false);
        }
      }


    async function getfavorites(fav) {
        const params ={
            userId:props?.userData?._id
        }
        try {
          const res = await props.get_allFAVORITES(params);
          var posts = res?.data
          console.log("pots=====>",posts);
          posts.map((item)=>{
            return {
                ...item,
                isplaying: false,
              };
          })
          if (posts) {
            setTimeout(() => {
                checkData( posts ,fav)
            }, 500);
          }
        //  setRefreshing(false);
        
        } catch (err) {
          setRefreshing(false);
          // alert(err);
          console.log(err);
        }
      }

      function checkData(posts,fav){
        console.log("$$$$$$$$$$$$$$$$$$$$$$$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        // return console.log(fav);
        if(fav.length > 0){
          let trueData = [];
          let fasleData = [];
          posts.map(item=>{
            fav.filter(child=>{
              // console.log(item._id)
              // console.log(item.trackName +"%%%%%%%%%%%%%%%%%%%%%%%%%%"+ child.trackName)
              if(item.trackName === child.trackName){
                trueData.push({...item,isdownloading:true,cat_name:child.cat_name})
              }else{
                fasleData.push({...item,isdownloading:false})
              }
            })
          })
          var ids = new Set(trueData.map(d => d._id));
          var merged = [...trueData, ...fasleData.filter(d => !ids.has(d._id))];
          // return console.log(merged);
  
          // console.log("id====>",merged)
          // let dub=finalData;
          const n = merged.filter((tag, index, dub) =>
          dub.findIndex((t)=> t._id === tag._id
          ) == index);
          // return console.log(n);
          
          setmeditations(n);
          setRefreshing(false);
        }else{
          // alert("called else")
          setmeditations(posts);
          setRefreshing(false);
        }
        
  
      }


    async function  favourities(item){
        setofflinefav(item)
        // return console.log(item);
        if(connection){
        setisplaying(false)
        const params = {
            trackId: item.trackId ,
            trackType: item.trackType,
            trackName: item.trackName,
            trackFile:item.trackFile,
            coverPic:item.coverPic,
            userId:props?.userData?._id
          };
        //   console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        //     console.log(item)
        //   console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        //   return
          try {
            const res = await props.set_fav(params);
            // console.log('group_data', res);
            if (res?.data) {
                // console.log(res?.data)
                let fav = internal
                getfavorites(fav)
                // Snackbar.show({
                //     text: res?.data,
                //     backgroundColor: '#018CAB',
                //     textColor: 'white',
                //   });
            //   setmeditations(res?.data);
            }
          //   setloadingGroup(false);
          } catch (err) {
          //   setloadingGroup(false);
            console.log(err);
          }
        }else{
            // Snackbar.show({
            //   text: 'No Internet Connection! ',
            //   backgroundColor: 'tomato',
            //   textColor: 'white',
            // });
          }
    }

    const setData = async (single,id,name) => {
        console.log(single.trackName)
        setisplaying(false)
        setTimeout(() => {
          if(connection){
            setTimeout(() => {
              if(single.isplaying){
                  const res = meditations.map((item)=>{
                      // console.log(item._id === id)
                      if(item._id === id){
                          return {
                              ...item,
                              isplaying: false,
                            };
                      } else {
                          return {
                              ...item,
                              // isplaying: false,
                            };
                      }
                  })
                  setmeditations(res)
                  setisplaying(false)
      
              }else{
      
                  const res = meditations.map((item)=>{
                      // console.log(item._id === id)
                      if(item._id === id){
                          return {
                              ...item,
                              isplaying: true,
                            };
                      } else {
                          return {
                              ...item,
                              isplaying: false,
                            };
                      }
                  })
                  setmeditations(res)
                  setisplaying(true)
      
              }    
          }, 500);
          }else{
            setTimeout(() => {
              if(single.isplaying){
                  const res = meditations.map((item)=>{
                      // console.log(item._id === id)
                      if(item.trackName === name){
                          return {
                              ...item,
                              isplaying: false,
                            };
                      } else {
                          return {
                              ...item,
                              // isplaying: false,
                            };
                      }
                  })
                  setmeditations(res)
                  setisplaying(false)
      
              }else{
      
                  const res = meditations.map((item)=>{
                      // console.log(item._id === id)
                      if(item.trackName === name){
                          return {
                              ...item,
                              isplaying: true,
                            };
                      } else {
                          return {
                              ...item,
                              isplaying: false,
                            };
                      }
                  })
                  setmeditations(res)
                  setisplaying(true)
      
              }    
          }, 500);
          }     
        }, 500);
        
          //  console.log("single==============>",single);
            try {
                await AsyncStorage.setItem("single_item",JSON.stringify({...single,type:'fav'}))
                await AsyncStorage.setItem("userId",JSON.stringify(props.userData._id))
            } catch (e) {
             console.log("calling itself"+e)
            }
        // alert('called set data')
                
                // var data = await AsyncStorage.getItem("single_item")
                // console.log(JSON.parse(data).trackName) 
    }

    async function requestToPermissions ()  {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Music',
              message:
                'App needs access to your Files... ',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('startDownload...');
            // this.startDownload();
          }else{
              alert("Permission must be granted for downloads to proceeds ")
          }
        } catch (err) {
          console.log(err);
        }
      };
    
    
    async function startDownload  (item,index)  {
        
      setmeditations(res)
        // const {tunes, token, currentTrackIndex} = this.state;
        let url  = item.trackFile;
        let name  = item.trackName;
        let coverUrl  = item.coverPic;
    
        // let dis = RNFetchBlob.fs.dirs
        // return console.log(dis.DownloadDir)
    
        const FolderPAth = '/storage/emulated/0/Download/FourRelax';
        const tracktype = '/storage/emulated/0/Download/FourRelax/favourties'
    
       RNFetchBlob.fs.isDir(FolderPAth).then((isDir)=>{
         if(isDir){
        //    alert('exist')
           RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
            if(isDir){
            //   alert('exist medii')
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
              RNFetchBlob.config({
                fileCache: true,
                appendExt: 'mp3',
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: true,
                  title: name,
                  path : SongDir,
                  // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  description: 'Downloading the file',
                },
              })
                .fetch('GET', url)
                .then(res => {
                  console.log(res);
                  console.log('The file is save to ', res.path());
                });
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'jpg',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: name+"_img",
                    path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name+"_img",
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Image',
                  },
                })
                  .fetch('GET', coverUrl)
                 
                  .then(res => {
                    console.log(res);
                    console.log('The file is save to ', res.path());
                  });
            }else{
              RNFetchBlob.fs.mkdir(tracktype).then(()=>{
                // alert('newly create medi')
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
              RNFetchBlob.config({
                fileCache: true,
                appendExt: 'mp3',
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: true,
                  title: name,
                  path : SongDir,
                  // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  description: 'Downloading the file',
                },
              })
                .fetch('GET', url)
                .then(res => {
                  console.log(res);
                  console.log('The file is save to ', res.path());
                });
    
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'jpg',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: name+"_img",
                    path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name+"_img",
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Image',
                  },
                })
                  .fetch('GET', coverUrl)
                 
                  .then(res => {
                    console.log(res);
                    console.log('The file is save to ', res.path());
                  });
    
              })
            }
          })
           
         }else{
          RNFetchBlob.fs.mkdir(FolderPAth).then(()=>{
            // alert('newly created')
            RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
              if(isDir){
                // alert('exist medii')
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'mp3',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: name,
                    path : SongDir,
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Downloading the file',
                  },
                })
                  .fetch('GET', url)
                  .then(res => {
                    console.log(res);
                    console.log('The file is save to ', res.path());
                  });
    
                  RNFetchBlob.config({
                    fileCache: true,
                    appendExt: 'jpg',
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: true,
                      title: name+"_img",
                      path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name+"_img",
                      // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                      description: 'Image',
                    },
                  })
                    .fetch('GET', coverUrl)
                   
                    .then(res => {
                      console.log(res);
                      console.log('The file is save to ', res.path());
                    });
    
              }else{
                RNFetchBlob.fs.mkdir(tracktype).then(()=>{
                //   alert('newly create medi')
                  let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'mp3',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: name,
                    path : SongDir,
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Downloading the file',
                  },
                })
                  .fetch('GET', url)
                  .then(res => {
                    console.log(res);
                    console.log('The file is save to ', res.path());
                  });
    
    
                  RNFetchBlob.config({
                    fileCache: true,
                    appendExt: 'jpg',
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: true,
                      title: name+"_img",
                      path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name+"_img",
                      // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                      description: 'Image',
                    },
                  })
                    .fetch('GET', coverUrl)
                   
                    .then(res => {
                      console.log(res);
                      console.log('The file is save to ', res.path());
                    });
                })
              }
            })
         })
        }
        })
        setTimeout(() => {
         
          // CheckConnectivity()
          return  
        }, 8000);
    
        
        
        
            // await AsyncStorage.setItem("")
    
      };

      async function deletefile(item,traname){
        setisplaying(false)
        let name = item.trackName;
        let cover = name.concat("_img");
        // return console.log(cover)
        let dir = RNFS.DownloadDirectoryPath + '/FourRelax/favourties/' + name; 
        let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/favourties/' + cover;
        try{
          let exists = await RNFS.exists(dir,dirImg);
          if(exists){
              // exists call delete
              await RNFS.unlink(dir).then(() => {
                console.log('1 deleted');
                RNFS.scanFile(dir)
                  .then(() => {
                    console.log('1 scanned');
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch((err) => {         
                  console.log(err);
              });
              await RNFS.unlink(dirImg).then(() => {
                console.log('2 deleted');
                RNFS.scanFile(dirImg)
                  .then(() => {
                    console.log('2 scanned');
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
              // console.log("File Not Available")
              // Snackbar.show({
              //   text: 'File Not Available',
              //   backgroundColor: 'tomato',
              //   textColor: 'white', 
              // });
          }
  
        
        }catch(e){
          console.log("error : "+e)
        }
        setTimeout(() => {
          CheckConnectivity()
        }, 500);
     
  
      }

      async function offlineFav(sing){
        // console.log(meditations);
        try{
          if(sing.liked == 'yes'){
            // setofflinefav(sing)
            const res = meditations.map((item)=>{
                // console.log(item.liked)
                if(item._id === sing._id){
                    return {
                        ...item,
                        liked: 'no',
                      };
                } else {
                    return {
                        ...item,
                        // isplaying: false,
                      };
                }
            })
            setmeditations(res)
          }else{
            // addRemoveFav(sing)
            // setofflinefav(sing)
            const res = meditations.map((item)=>{
                // console.log(item.liked)
                if(item._id === sing._id){
                    return {
                        ...item,
                        liked: 'yes',
                      };
                } else {
                    return {
                        ...item,
                        // isplaying: false,
                      };
                }
            })
            setmeditations(res)
          }
            setofflinefav(sing)
          // setItemData(sing)
        }catch(e){
          console.log(e);
        }
      } 
       
      async function setofflinefav(item){
        let name = item.trackName
        var res = await AsyncStorage.getItem(name)
        var rep = JSON.parse(res)
        // console.log("rep=====",rep);
        if(rep.liked == 'yes'){
          addRemoveFav(item)
    
          rep = ({...rep,liked : 'no'})
        }
        else{
          addRemoveFav(item)
    
          rep = ({...rep,liked : 'yes'})
        }
        console.log(rep.liked);
        await AsyncStorage.setItem(name,JSON.stringify(rep))
       
      }

      async function addRemoveFav(post){
        // if(post.liked == 'yes'){
        //     let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
        //     let desPath = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
        //     const favPath = '/storage/emulated/0/Download/FourRelax/favourties'
        //     let meditation = [];
        //     var filePath = [];
        //     var ImagePath = [];
        //     let local = [];
        //     RNFetchBlob.fs.isDir(dir).then((isDir)=>{
        //       // return console.log(isDir);
        //       if(isDir){
        //         RNFS.readDir(dir).then(files => {
        //           files.map(async(item)=>{
        //             try{
        //               RNFetchBlob.fs.isDir(favPath).then(async(isDir)=>{
        //                 if(isDir){
        //                   // alert('exists')
        //                   if(item.name === post.trackName){
        //                     if (item.path.startsWith('/')) {
        //                       const url = item.path
        //                       const uriComponents = url.split('/')
        //                       const fileNameAndExtension = uriComponents[uriComponents.length - 1]
        //                       // const destPath =  desPath+fileNameAndExtension
        //                       // console.log(destPath);
        //                       const destPath = `${desPath}/${fileNameAndExtension}`
        //                       console.log(destPath);
        //                       await RNFS.copyFile(url, destPath)
        //                     }
        //                   }
        //                 }else{
        //                   RNFetchBlob.fs.mkdir(favPath).then(async()=>{
        //                     // alert("created")
        //                     if(item.name === post.trackName){
        //                       if (item.path.startsWith('/')) {
        //                         const url = item.path
        //                         const uriComponents = url.split('/')
        //                         const fileNameAndExtension = uriComponents[uriComponents.length - 1]
        //                         // const destPath =  desPath+fileNameAndExtension
        //                         // console.log(destPath);
        //                         const destPath = `${desPath}/${fileNameAndExtension}`
        //                         console.log(destPath);
        //                         await RNFS.copyFile(url, destPath)
        //                       }
        //                     }
        //                   })
        //                 }
        //               })
                      
                  
        //             }catch(e){
        //               console.log(e);
        //             }
        //           })
        //         })
                  
        //       }else{
        //         Snackbar.show({
        //           text: 'No local data found',
        //           backgroundColor: '#018CAB',
        //           textColor: 'white',
        //         });
              
        //       }
        //     })
        // }
        // else{
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
                CheckConnectivity()
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
        // }
      }


    return (
        <View style={{flex:1,backgroundColor:'#00303A'}}>
            <ImageBackground
                source={favpost}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>FAVOURITES</Text>
                <Image
                    source={logo}
                    style={[styles.img,{marginTop:responsiveHeight(15)}]}
                />
                
            </ImageBackground>
            <>
              {refreshing?
                  <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}} />
              :
                <>
                  {meditations.length < 1 ?
                    <>
                      {connection?
                        <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                          <Text style={styles.title} >Empty</Text>
                        </View>
                      :
                      <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                          <Text style={styles.title} >Empty</Text>
                      </View>
                      }
                    </>
                  :
                    <FlatList
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={CheckConnectivity} />
                            }
                            style={{width:'100%'}}
                            numColumns={'2'}
                            showsVerticalScrollIndicator={false}
                            data={meditations}
                            renderItem={({ item, index }) =>
                                <View style={{width:'46.8%',margin:6,alignItems:'center'}}>
                                    <ImageBackground
                                        source={{uri : item.trackType === 'Meditation'?  'file://' + localMediImage:
                                        item.trackType === 'Sounds'? 'file://' + localSounImage : 'file://' + localStorImage }}
                                        // source={{uri :  connection? item.coverPic : 'file://' + item.coverPic}}
                                        borderRadius={4}
                                        style={{width:'100%',height:178}}
                                    >
                                        <View style={{flexDirection:'row',flex:0.3}}>
                                            <View style={{flex:0.29}}>
                                                <TouchableOpacity onPress={()=> connection?favourities(item): offlineFav(item)} style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}>
                                                    <Image
                                                        source={fav}
                                                        style={[styles.icon,{
                                                            tintColor: item.liked === 'no'? 'white' :'#FF4040'
                                                        }]}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.8,alignItems:'flex-end'}}>
                                            {item.isdownloading?
                                                <TouchableOpacity onPress={()=>{deletefile(item,item.trackName)}}  style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                                    <Image
                                                        source={del}
                                                        style={styles.icon}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity  style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                                  <Image
                                                      source={del}
                                                      style={styles.icon}
                                                  />
                                              </TouchableOpacity>
                                              }
                                            </View>
                                        </View>
                                        <View style={{flex:0.4}}></View>
                                        <View style={{flex:0.25,width:'100%',alignItems:'center'}} >
                                      
                                            {/* {!(props?.userData?.subscriptionDetail?.subscriptionId === item.subscriptionType)?
                                                <TouchableOpacity onPress={()=> console.log(props?.userData?._id +"==="+ item.subscriptionType)}  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                    <Image
                                                        source={unloc}
                                                        style={[styles.icon,{width:15,height:19}]}
                                                    />
                                                </TouchableOpacity>
                                            :
                                            <>
                                            {item.isdownloading? */}
                                                <>
                                                    {item.isplaying?
                                                        <TouchableOpacity onPress={()=> setData(item,item._id,item.trackName)} style={[styles.iconBackground,{width:34,height:34,top:5,}]}>
                                                            <Image
                                                                source={pause}
                                                                style={[styles.icon,{width:22.67,height:22.67}]}
                                                            />
                                                        </TouchableOpacity>
                                                        :
                                                        
                                                        <TouchableOpacity onPress={()=> setData(item,item._id,item.trackName)}
                                                            style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                            <Image
                                                                source={play}
                                                                style={[styles.icon,{width:22,height:22}]}
                                                            />
                                                        </TouchableOpacity>
                                                    }
                                                </>
                                              {/* :
                                                <TouchableOpacity onPress={()=> {
                                                  startDownload(item,index)
                                                  // setislock(!islock)
                                                  }} style={{justifyContent:'center',top:5,marginLeft:responsiveWidth(2)}}  >
                                                  <Image
                                                      source={download}
                                                      style={[styles.icon,{width:34,height:34,}]}
                                                  />
                                                </TouchableOpacity>
                                            }
                                            </>
                                          } */}
                                          {item.progress &&
                                            <ActivityIndicator
                                            size={'large'}
                                            style={{position:'absolute',top:1,left:8,right:0,bottom:0}}
                                            color={'white'}
                                            // animating={item.progress}
                                            />
                                        } 
                                            
                                        </View>
                                    </ImageBackground>
                                </View>
                            }
                        />
                  } 
                </>
              }
            </>
            {meditations.length < 1 ?
             null
            :
            <>
              {isplaying?
                  <Soundplayer navigation={props.navigation} />
                  :
              null}
            </>
          }   
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
  