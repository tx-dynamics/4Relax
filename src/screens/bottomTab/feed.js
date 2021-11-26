import React,{useState,useEffect} from 'react'
  import {View,Text,PermissionsAndroid,ImageBackground,Image,FlatList,RefreshControl,Dimensions, ActivityIndicator} from 'react-native'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import NetInfo from "@react-native-community/netinfo";
import Soundplayer from './playing'
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {get_allmeditation,set_fav,get_categories} from '../../redux/actions/meditation';
import {unloc,pause,play,download,fav,logo,del,cover} from '../../assets'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');





 const feed = (props) => {

    const isFocused = useIsFocused();
    const [localImage,setImage ] =  useState()
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(true)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [item,setitem ] =  useState()
    const [refreshing, setRefreshing] = useState(true);
    const [meditations,setmeditations ] =  useState([])
    const [internal,setInternal ] =  useState([])
    const [category,setcategory ] =  useState([])
    const [localjson,setLocaljson ] =  useState([])
    const [connection,setConnect ] =  useState(false)
    const [once,setOnce ] =  useState(true)
    const [onceConnect,setonceConnect ] =  useState(true)

    useEffect(() => {
      requestToPermissions()
      // console.log("has sub ====================>",props?.userData?.subscriptionDetail?.subscriptionId);
        // CheckConnectivity()
        checkInternet()
        setcateEmp(false)
        setisplaying (false)
    }, [isFocused])

    async function checkInternet (){
      NetInfo.fetch().then((state) => {
        // setConnect(state.isConnected)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected,state.isInternetReachable);
        //if (Platform.OS === "android") {
          if (state.isConnected) {
            get_category()
          } else {
            let cat = '';
            CheckConnectivity(cat)
          }
        
      });
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


    async function get_category(){
      try {
        const res = await props.get_categories();
        var posts = res?.data
        
        var rest = posts.map((item,index)=>{
          if(index === 0){
              return {
                ...item,
                selected: true,
              }
            }else{
              return {
                ...item,
                selected: false,
              }
            }
          
        })
        var first = posts[0];
        var seleted = {...first,selected:true}
        // alert(seleted.name);
        setcategory(rest)

        CheckConnectivity(seleted.name)
        


      } catch (err) {
        setRefreshing(false);

        console.log(err);
      }
    }
    
    function CheckConnectivity  (cat = '')  {
      setisplaying(false)
      setRefreshing(true);
      // For Android devices
      NetInfo.fetch().then((state) => {
        setConnect(state.isConnected)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected,state.isInternetReachable);
        //if (Platform.OS === "android") {
          if (state.isConnected) {
            getFiles(state,cat)
            setOnce(true)
            if(!onceConnect){
              Snackbar.show({
                text: 'You are Connected !',
                backgroundColor: '#018CAB',
                textColor: 'white',
              });
              setonceConnect(true)
            }
            
          } else {
            getFiles(state,cat)
            if(once){
              Snackbar.show({
                text: 'You are not Connected to Internet, Continuing Offline!',
                backgroundColor: '#018CAB',
                textColor: 'white',
              });
              setonceConnect(false)
              setOnce(false)
            }
            
          }
        
      });
    };

    async function getFiles(state,cat){
      // return alert(cat)
      // AsyncStorage.clear()
      let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
      let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'
      let meditation = [];
      var filePath = [];
      var ImagePath = '' ;
      let local = [];

      RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(Imgdir).then(files => {
            files.map((item)=>{
              if(item.name === "Meditation"){
                ImagePath = item.path

                setImage(item.path)
              // return console.log(files);
            }
            })
          })
        }
      })
      // setTimeout(() => {
      //   console.log("called ---====----->",ImagePath)
        
      // }, 200);

      // return

      RNFetchBlob.fs.isDir(dir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(dir).then(files => {
            files.map((item)=>{
              // console.log(item)  
              // if(item.name.includes("_img")){
              //   // console.log(item.name+"&&&&&&&&&&&&&&&&&&&&&&"+item.name.split("_")[0])
              //   ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
              // }else{
                filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
              // }
            })
            filePath.map(async(item)=>{
              // ImagePath.map(async(img)=>{
              //   if(item.trackName === img.name){
                  // console.log("called iside looop ---====----->",ImagePath)

                  var res = await getLocalJson(ImagePath,item,item.trackName,state,cat)
                  // console.log("local===========>",res);
                  meditation.push(res)
                  // meditation.push({"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,exists:true})
              //   }
              // })
            })
            // meditation = [{...filePath,...ImagePath}]
            // console.log("????????????????????????????????????????")
            // console.log(meditation)
            // console.log(ImagePath)
            if(state.isConnected){
              // console.log(meditation)
              // alert("called internal medi")
              setInternal(meditation)
              let cate = cat;
              let cover = '';
              getMeditation(cate,cover,meditation)
    
            }else{
              setTimeout(() => {
                console.log("HERE++++++++++++++++++++++++++>>>>",meditation)
                // console.log(meditation)
                setmeditations(meditation)
                setRefreshing(false);  
              }, 1000);
              
            }
    
    
          }).catch(err => {
            setRefreshing(false);
            console.log(err.message, err.code);
          });
        }else{
          // Snackbar.show({
          //   text: 'No local data found',
          //   backgroundColor: '#018CAB',
          //   textColor: 'white',
          // });
          // console.log("HERE++++++++++++++++++++++++++>>>>",meditation)
          let cate = cat;
          let cover = '';
          getMeditation(cate,cover,meditation)
        }
      })
    }

    async function getLocalJson (img,item,name,state,cat){
      let meditation = {}
      let obj = await AsyncStorage.getItem(name);
      // return console.log("here=====local json========>",JSON.parse(obj))
      let pared = JSON.parse(obj) 
      // return console.log("here=====local pared json========>",pared)
        if (pared != null){      
          // if(item.trackName === img.name){  
            console.log('pared exists')
            meditation = ({
              "_id":pared._id,
              "liked":pared.liked,
              "cat_name":pared.trackCategory.name,
              "trackType": pared.trackType,
              "trackFile":item.trackFile,
              "trackName":item.trackName,
              "coverPic":img,
              isdownloading:item.isdownloading,
              isplaying: false,
              exists:true
            })
          // }
        }else{
          // if(item.trackName === img.name){  
            meditation = ({
              // "_id":pared._id,
              // "liked":pared.liked,
              // "cat_name":pared.trackCategory.name,
              // "trackType": pared.trackType,
              "trackFile":item.trackFile,
              "trackName":item.trackName,
              "coverPic":img,
              isdownloading:item.isdownloading,
              isplaying: false,
              exists:true
            })
          // }
        }
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

    async function getMeditation( cate = '',cover = '' , meditation  ) {
      // return console.log("!!!!!!!!!!!!!!!!!!^^^^^^^^^^^^^^^^^^^!!!!!!!!!!!!!!!!!!"+category)
        // setRefreshing(true);
        const params = {
            userId: props?.userData?._id
        }
        try {
          const res = await props.get_allmeditation(params);
          var posts = res?.data
          posts.map((item)=>{
            return {
                ...item,
                isplaying: false,
                progress:false,
              };
          })

          if (posts) {
              if(cate === ''){
                // setmeditations(posts)
                // setTimeout(() => {
                  checkData(posts,meditation)
                // }, 1000);
              }else{
                setmeditations([])

                var filtered = []; 
                posts.map((item)=>{
                    filtered.push(item)
                })
               
                let getFilter = [];
                setcateEmp(false)

                filtered.map((item)=>{
                  // let str =item.trackCategory 
                  // let str2 = str.charAt(0).toUpperCase() + str.slice(1)
                  // console.log(item.trackCategory.name === cate)
                    if(item.trackCategory.name === cate){
                        getFilter.push(item);
                    }else{
                      return
                    }
                })
                // return console.log(getFilter)
                if(getFilter.length < 1){
                  
                  setcateEmp(true)
                  setmeditations([])
                }else{
                  // return console.log(getFilter)
                    checkData(getFilter,meditation)
                }
                // setmeditations(getFilter)
               

              }
          }


        } catch (err) {
          setRefreshing(false);
          // alert("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
          console.log(err);
        }
       
      }

    function checkData(posts,meditation){
      console.log("&^&^&^&^&^&^&^&^&^&^&^&^&^^&^&^^")
      // return console.log(posts );
      if(meditation.length > 0  ){
        let trueData = [];
        let fasleData = [];
        // console.log(posts._id);
        posts.map(item=>{
          meditation.filter(child=>{
            // console.log(item._id);
            if(item.trackName === child.trackName){
              trueData.push({...item,isdownloading:true})
            }
            else{
              fasleData.push({...item,isdownloading:false})
            }
          })
        })
       
        var ids = new Set(trueData.map(d => d._id));
        var merged = [...trueData, ...fasleData.filter(d => !ids.has(d._id))];

        // console.log("id====>",merged)
        // let dub=finalData;
        const n = merged.filter((tag, index, dub) =>
        dub.findIndex((t)=> t._id === tag._id
        ) == index);


        // n.map(item =>  console.log('id==>',item._id,"%%%%%%%%%%% donloading=>",item.isdownloading,'\n'))

        setmeditations(n);
        setRefreshing(false);
      }else{
        // alert("where are you")
        setmeditations(posts);
        setRefreshing(false);
      }
     

    }

    async function  favourities(item){
      // alert('called')
      setofflinefav(item)

      if(connection){
        const params = {
          trackId: item._id,
          trackType: "meditation",
          trackName: item.trackName,
          trackFile:item.trackFile,
          coverPic:item.trackCategory.coverPic,
          subscriptionType:item.subscriptionType,
          userId:props?.userData?._id
        };
          // console.log(params)
        try {
          const res = await props.set_fav(params);
          // console.log('group_data', res);
          if (res?.data) {
              // console.log(res?.data)
              let cat = item.trackCategory.name;
              let cover = '';
              let medi = internal
              getMeditation(cat,cover,medi)
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
        Snackbar.show({
          text: 'No Internet Connection! ',
          backgroundColor: 'tomato',
          textColor: 'white',
        });
      }
        
    }


    async function getcate(item,id){
        // console.log(item.selected)
        setisplaying(false)
        if(item.selected){
            // alert('called if')
                const res = category.map((item) => {
                console.log(item._id === id);
                  if (item._id === id) {
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
              // alert('calling else')
            const res = category.map((item) => {
              // console.log(item._id === id);
                if (item._id === id) {
                let medi = internal
                // console.log(item);
                setRefreshing(true)
                  getMeditation(item.name,item.coverPic,medi)
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

    const setData = async (single,id) => {
        // console.log(item.trackName)
        setisplaying(false)
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
       
        if(!single.isplaying){
        try {
              let uid = JSON.stringify(props.userData._id)
              // console.log(uid);
              await AsyncStorage.setItem("single_item",JSON.stringify({...single,type:'Meditation'}))
              // alert(1)
              await AsyncStorage.setItem("userId",JSON.stringify(props.userData._id))
              // alert(2)

          } catch (e) {
            console.log(e)
          }
        }else{
          // alert('nothing')
        }
        
        
    }

    const setOfflineData = async (single,name) => {
      // console.log(item.trackName)
      setisplaying(false)
      
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
      if(!single.isplaying){
          try {
            await AsyncStorage.setItem("single_item",JSON.stringify({...single,type:'meditation'}))
            // await AsyncStorage.setItem("userId",props?.userData?._id)

        } catch (e) {
          console.log(e)
        }
      }else{
        // alert('nothing')
      }
      
      // alert('called set data')
              
              // var data = await AsyncStorage.getItem("single_item")
              // console.log(JSON.parse(data).trackName) 
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
    
  async function startDownload  (item,id)  {
        // if(item.progress === false){
            const res = meditations.map((post)=>{
              if(post._id === id){
                return {
                  ...post,
                  progress:true
                }
              }else{
                return {
                  ...post,
                }
              }
          })
          setmeditations(res)
        // }
        
        // const {tunes, token, currentTrackIndex} = this.state;
        let url  = item.trackFile;
        let name  = item.trackName;
        // let coverUrl  = item.trackCategory.coverPic;

        // let dis = RNFetchBlob.fs.dirs
        // return console.log(coverUrl)

        const FolderPAth = '/storage/emulated/0/Download/FourRelax';
        const tracktype = '/storage/emulated/0/Download/FourRelax/meditation'

       RNFetchBlob.fs.isDir(FolderPAth).then((isDir)=>{
         if(isDir){
          //  alert('exist')
           RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
            if(isDir){
              // alert('exist medii')
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name
              RNFetchBlob.config({
                fileCache: true,
                appendExt: 'mp3',
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: false,
                  title: name,
                  path : SongDir,
                  // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  description: 'Downloading the file',
                },
              })
                .fetch('GET', url)
               
                .then(res => {
                  // console.log(res);
                  // console.log('The file is save to ', res.path());
                });
                // RNFetchBlob.config({
                //   fileCache: true,
                //   appendExt: 'jpg',
                //   addAndroidDownloads: {
                //     useDownloadManager: true,
                //     notification: false,
                //     title: name+"_img",
                //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name+"_img",
                //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                //     description: 'Image',
                //   },
                // })
                //   .fetch('GET', coverUrl)
                 
                //   .then(res => {
                //     // console.log(res);
                //     // console.log('The file is save to ', res.path());
                //   });
            }else{
              RNFetchBlob.fs.mkdir(tracktype).then(()=>{
                // alert('newly create medi')
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name
              RNFetchBlob.config({
                fileCache: true,
                appendExt: 'mp3',
                addAndroidDownloads: {
                  useDownloadManager: true,
                  notification: false,
                  title: name,
                  path : SongDir,
                  // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  description: 'Downloading the file',
                },
              })
                .fetch('GET', coverUrl)
                .then(res => {
                  // console.log(res);
                  // console.log('The file is save to ', res.path());
                });

                // RNFetchBlob.config({
                //   fileCache: true,
                //   appendExt: 'jpg',
                //   addAndroidDownloads: {
                //     useDownloadManager: true,
                //     notification: false,
                //     title: name+"_img",
                //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name+"_img",
                //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                //     description: 'Image',
                //   },
                // })
                //   .fetch('GET', coverUrl)
                 
                //   .then(res => {
                //     // console.log(res);
                //     // console.log('The file is save to ', res.path());
                //   });


              })
            }
          })
           
         }else{
          RNFetchBlob.fs.mkdir(FolderPAth).then(()=>{
            // alert('newly created')
            RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
              if(isDir){
                // alert('exist medii')
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'mp3',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    title: name,
                    path : SongDir,
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Downloading the file',
                  },
                })
                  .fetch('GET', url)
                  .then(res => {
                    // console.log(res);
                    // console.log('The file is save to ', res.path());
                  });


                  // RNFetchBlob.config({
                  //   fileCache: true,
                  //   appendExt: 'jpg',
                  //   addAndroidDownloads: {
                  //     useDownloadManager: true,
                  //     notification: false,
                  //     title: name+"_img",
                  //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name+"_img",
                  //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  //     description: 'Image',
                  //   },
                  // })
                  //   .fetch('GET', coverUrl)
                   
                  //   .then(res => {
                  //     // console.log(res);
                  //     // console.log('The file is save to ', res.path());
                  //   });

              }else{
                RNFetchBlob.fs.mkdir(tracktype).then(()=>{
                  // alert('newly create medi')
                  let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name
                RNFetchBlob.config({
                  fileCache: true,
                  appendExt: 'mp3',
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    title: name,
                    path : SongDir,
                    // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                    description: 'Downloading the file',
                  },
                })
                  .fetch('GET', url)
                  .then(res => {
                    // console.log(res);
                    // console.log('The file is save to ', res.path());
                  });

                  // RNFetchBlob.config({
                  //   fileCache: true,
                  //   appendExt: 'jpg',
                  //   addAndroidDownloads: {
                  //     useDownloadManager: true,
                  //     notification: false,
                  //     title: name+"_img",
                  //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/meditation'+ '/' + name+"_img",
                  //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                  //     description: 'Image',
                  //   },
                  // })
                  //   .fetch('GET', coverUrl)
                   
                  //   .then(res => {
                  //     // console.log(res);
                  //     // console.log('The file is save to ', res.path());
                  //   });

                })
              }
            })
         })
        }
        })
        // console.log(dirs.DocumentDir);
        // setmeditations(res)

        setItemData(item)

        setTimeout(() => {
          const res = meditations.map((post)=>{
            if(post._id === id){
              return {
                ...post,
                progress:false
              }
            }else{
              return {
                ...post,
              }
            }
        })
          setmeditations(res)
          CheckConnectivity(item.trackCategory.name)
          return  
        }, 8000);
         
  };


    async function  setItemData(item){
      try{
        let name = item.trackName
        await AsyncStorage.setItem(name,JSON.stringify(item))
        // alert("set item successfully")
      }catch(e){
        alert(e)
      }
    }


    async function deletefile(item,traname){
      // return console.log(item);
      let name = item.trackName;
      try {
          await AsyncStorage.removeItem(name);
          // alert('cleared item')
          // return true;
      }
      catch(exception) {
        alert(exception)
          // return false;
      }
      // return
      setisplaying(false)
      // let name = item.trackName;
      let cover = name.concat("_img");
      // return console.log(cover)
      let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + name; 
      let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + cover;
      try{
        let exists = await RNFS.exists(dir,dirImg);
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
            await RNFS.unlink(dirImg).then(() => {
              // console.log('2 deleted');
              RNFS.scanFile(dirImg)
                .then(() => {
                  // console.log('2 scanned');
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
            Snackbar.show({
              text: 'File Not Available',
              backgroundColor: 'tomato',
              textColor: 'white', 
            });
        }

      
      }catch(e){
        console.log("error : "+e)
      }
      if(item.liked === "yes"){
        // alert('called')
        addRemoveFav(item)
        favourities(item)
      }
      setTimeout(() => {
        if(connection){
          CheckConnectivity(item.trackCategory.name)
        }else{
          let cate = ''
          CheckConnectivity(cate)
        }
      }, 1500);
   

    }

    async function addRemoveFav(post){
      if(post.liked != 'yes'){
          let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
          let desPath = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
          const favPath = '/storage/emulated/0/Download/FourRelax/favourties'
          let meditation = [];
          var filePath = [];
          var ImagePath = [];
          let local = [];
          RNFetchBlob.fs.isDir(dir).then((isDir)=>{
            // return console.log(isDir);
            if(isDir){
              RNFS.readDir(dir).then(files => {
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
                    
                    //   let fil = item.path.getFileUri()
                    //   // const fileNameAndExtension = fil.length - 1
                    //    console.log(fil);
                    //   // const destPath = `${ReactNativeFS.CachesDirectoryPath}/${fileSelected.name}`;
                    // await RNFS.copyFile(fil, destPath);
                    // copyToFav(item)
                      // console.log(item);
                    // }
                  }catch(e){
                    console.log(e);
                  }
                })
              })
                  // console.log(item)  
                //   if(item.name.includes("_img")){
                //     // console.log(item.name+"&&&&&&&&&&&&&&&&&&&&&&"+item.name.split("_")[0])
                //     ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                //   }else{
                //     filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
                //   }
                // })
                // filePath.map(async(item)=>{
                //   ImagePath.map(async(img)=>{
                //     if(item.trackName === img.name){
                //       var res = await getLocalJson(img,item,item.trackName,state,cat)
                //       console.log("local===========>",res);
                //       meditation.push(res)
                //       // meditation.push({"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,exists:true})
                //     }
                //   })
                // })
                // meditation = [{...filePath,...ImagePath}]
                // console.log("????????????????????????????????????????")
                // console.log(meditation)
                // console.log(ImagePath)
                // if(state.isConnected){
                //   // console.log(meditation)
                //   // alert("called internal medi")
                //   setInternal(meditation)
                //   let cate = cat;
                //   let cover = '';
                //   getMeditation(cate,cover,meditation)
        
                // }else{
                //   setTimeout(() => {
                //     console.log("HERE++++++++++++++++++++++++++>>>>",meditation)
                //     // console.log(meditation)
                //     setmeditations(meditation)
                //     setRefreshing(false);  
                //   }, 1000);
                  
                // }
        
        
              // }).catch(err => {
              //   setRefreshing(false);
              //   console.log(err.message, err.code);
              // });
            }else{
              Snackbar.show({
                text: 'No local data found',
                backgroundColor: '#018CAB',
                textColor: 'white',
              });
              // console.log("HERE++++++++++++++++++++++++++>>>>",meditation)
              // let cate = cat;
              // let cover = '';
              // getMeditation(cate,cover,meditation)
            }
          })
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
              // await RNFS.unlink(dirImg).then(() => {
              //   // console.log('2 deleted');
              //   RNFS.scanFile(dirImg)
              //     .then(() => {
              //       // console.log('2 scanned');
              //     })
              //     .catch(err => {
              //       console.log(err);
              //     });
              // })
              // .catch((err) => {         
              //     console.log(err);
              // });
              // console.log(name+"Deleted");
              // Snackbar.show({
              //   text: name+' Deleted',
              //   backgroundColor: '#018CAB',
              //   textColor: 'white',
              // });
          }else{
              console.log("File Not Available")
              Snackbar.show({
                text: 'File Not Available',
                backgroundColor: 'tomato',
                textColor: 'white', 
              });
        }

      
      }catch(e){
        console.log("error : "+e)
      }
      }
    }

    async function copyToFav  (item)  {
        
      // setmeditations(res)
        // const {tunes, token, currentTrackIndex} = this.state;
        let url  = item.trackFile;
        let name  = item.trackName;
        let coverUrl  = item.coverPic;
    
        // let dis = RNFetchBlob.fs.dirs
        // return console.log(dis.DownloadDir)
        let originalDir = RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'
        let destDir = RNFetchBlob.fs.dirs.DownloadDir + '/FourRelax/meditation'
        // let destDir = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
    
        const FolderPAth = '/storage/emulated/0/Download/FourRelax/meditation';
        const tracktype = '/storage/emulated/0/Download/FourRelax/favourties'
      
        // alert("called")
        // RNFetchBlob.fs.cp(destDir, originalDir)
        // .then(() => { alert('called copied data 1') })
        // .catch((e) => { console.log(e) })
       RNFetchBlob.fs.isDir(FolderPAth).then((isDir)=>{
        //  return alert(isDir)
         if(isDir){
          //  alert('exist 1')
           RNFetchBlob.fs.isDir(tracktype).then(async(isDir)=>{
            //  return alert(isDir)
            if(isDir){
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
              RNFetchBlob.fs.cp(originalDir, destDir)
              .then(() => { alert('called copied data 1') })
              .catch((e) => { alert(e) })
              
                // RNFS.copyFile(originalDir, destDir).then(res => {
              //   alert(res)
              //   // expect(res).to.be(undefined);
              // });
              alert('exist medii 1')
            }else{
              RNFetchBlob.fs.mkdir(tracktype).then(async()=>{
              alert('newly create medi 1')
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
                // await ReactNativeFS.copyFile(item.path, SongDir);
                RNFetchBlob.fs.cp(originalDir, originalDir)
                .then(() => { alert('called copied data 2') })
                .catch((e) => { alert(e) })
                // RNFS.copyFile(originalDir, destDir).then(res => {
                //   alert(res)
                //   // expect(res).to.be(undefined);
                // });
              })
            }
          })
           
         }
        //  else{
        //   RNFetchBlob.fs.mkdir(FolderPAth).then(()=>{
        //     alert('newly created 2')
        //     RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
        //       if(isDir){
        //         alert('exist medii 2')
        //         let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
                
        //       }else{
        //         alert('newly create medi 2')
        //         RNFetchBlob.fs.mkdir(tracktype).then(()=>{
        //           alert('newly create medi 2.2')
        //           let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/favourties'+ '/' + name
        //           RNFS.copyFile(originalDir, destDir).then(res => {
        //             alert(res)
        //             // expect(res).to.be(undefined);
        //           });
        //         })
        //       }
        //     })
        //  })
        // }
        })
        setTimeout(() => {
         
          // CheckConnectivity()
          return  
        }, 8000);
    
    
      };
  


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
                  style={{width:'100%',left:responsiveWidth(2)}}
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
                            <TouchableOpacity onPress={()=> getcate(item,item._id) }>
                                <Text style={{color:'black',justifyContent:'center'}}>{item.name}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                      :
                      <TouchableOpacity onPress={()=> getcate(item,item._id) } style={[styles.cate,{backgroundColor:'white'}]}>
                            <Text style={{color:'black',justifyContent:'center'}}>{item.name}</Text>
                        </TouchableOpacity>
                      }
                  </View>
                  }/>
            </ImageBackground>
            {cateEmp?
                  <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                      <Text style={styles.title} >Your selected category is empty</Text>
                  </View>
                  :
                  <>
                    {refreshing?
                      null
                    :
                      <>
                        { meditations.length < 1  ?
                        <>
                        {connection?
                          <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.title} >Meditation List is empty</Text>
                          </View>
                        :
                        <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.title} >No local data found</Text>
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
                                      source={{uri : 'file://' + localImage }}
                                        // item.cover?
                                        //   item.cover
                                        // : 
                                        //   connection?
                                        //     item.trackCategory.coverPic 
                                        //   :
                                        //     'file://' + item.coverPic}}
                                      borderRadius={4}
                                      style={{width:'100%',height:178}}
                                  >
                                      <View style={{flexDirection:'row',flex:0.3}}>
                                          <View style={{flex:0.29}}>
                                            {connection?
                                            <>
                                            {/* {!(props?.userData?.subscriptionDetail?.subscriptionId === item.subscriptionType)?
                                              null
                                            :
                                            <> */}
                                              {item.isdownloading?
                                                // <TouchableOpacity onPress={()=> connection? alert('online') : alert('offonline') } 
                                                <TouchableOpacity onPress={()=> favourities(item)  } 
                                                // style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}
                                                style={{height:40}}
                                                >
                                                    <View style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]} >
                                                      <Image
                                                          source={fav}
                                                          style={[styles.icon,{
                                                              tintColor: item.liked === 'no'? 'white' :'#FF4040'
                                                          }]}
                                                      />
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                              :
                                              null}
                                            {/* </>
                                            } */}
                                            </>
                                            :
                                            <>
                                            {item.isdownloading?
                                                <TouchableOpacity onPress={()=>  offlineFav(item)} 
                                                // style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}
                                                style={{height:40}}
                                                >
                                                    <View style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]} >
                                                      <Image
                                                          source={fav}
                                                          style={[styles.icon,{
                                                              tintColor: item.liked === 'no'? 'white' :'#FF4040'
                                                          }]}
                                                      />
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                              :
                                              null}
                                            </>}
                                            
                                              
                                          </View>
                                          <View style={{flex:0.8,alignItems:'flex-end'}}>
                                          {connection?
                                          // <>
                                          // {!(props?.userData?.subscriptionDetail?.subscriptionId === item.subscriptionType)?
                                          //     null
                                          //   :
                                            <>
                                              {item.isdownloading?
                                                <TouchableOpacity onPress={()=>{deletefile(item,item.trackName)}}  style={{height:40}} >
                                                    <View style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                                      <Image
                                                          source={del}
                                                          style={styles.icon}
                                                      />
                                                    </View>
                                                </TouchableOpacity>
                                              :
                                              null}
                                            </>
                                          //   }
                                          // </>
                                            :
                                          <>
                                              {item.isdownloading?
                                                <TouchableOpacity onPress={()=>{deletefile(item,item.trackName)}}  style={{height:40}} >
                                                    <View style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]}>
                                                      <Image
                                                          source={del}
                                                          style={styles.icon}
                                                      />
                                                    </View>
                                                </TouchableOpacity>
                                              :
                                              null}
                                            </>
                                            }
                                              
                                              
                                          </View>
                                      </View>
                                      <View style={{flex:0.4}}></View>
                                      <View style={{flex:0.25,alignItems:'center'}} >
                                            {connection?
                                              // <>
                                              // {!(props?.userData?.subscriptionDetail?.subscriptionId === item.subscriptionType)? 
                                              //     <TouchableOpacity onPress={()=> 
                                              //         props.navigation.navigate('Packages')
                                              //     }
                                              //     style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                              //         <Image
                                              //             source={unloc}
                                              //             style={[styles.icon,{width:15,height:19}]}
                                              //         />
                                              //     </TouchableOpacity>
                                              //       :
                                                    <>
                                                    {item.isdownloading?
                                                        <>
                                                          {item.isplaying?
                                                              <TouchableOpacity onPress={()=> setData(item,item._id)} 
                                                              style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                                    <Image
                                                                        source={pause}
                                                                        style={[styles.icon,{width:22.67,height:22.67}]}
                                                                    />
                                                              </TouchableOpacity>
                                                              :
                                                              <TouchableOpacity onPress={()=> setData(item,item._id)}
                                                                  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                                  <Image
                                                                      source={play}
                                                                      style={[styles.icon,{width:22,height:22}]}
                                                                  />
                                                              </TouchableOpacity>
                                                          }
                                                        </>
                                                      :
                                                        <TouchableOpacity onPress={()=> {
                                                          startDownload(item,item._id)
                                                          }} style={{justifyContent:'center',top:5,marginLeft:responsiveWidth(2)}}  >
                                                          <Image
                                                              source={download}
                                                              style={[styles.icon,{width:34,height:34,}]}
                                                          />
                                                        </TouchableOpacity>
                                                    }
                                                    </>
                                              //   }
                                              // </>
                                              :
                                              <>
                                                {item.isdownloading?
                                                    <>
                                                      {item.isplaying?
                                                          <TouchableOpacity onPress={()=> setOfflineData(item,item.trackName)} 
                                                          style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                                <Image
                                                                    source={pause}
                                                                    style={[styles.icon,{width:22.67,height:22.67}]}
                                                                />
                                                          </TouchableOpacity>
                                                          :
                                                          <TouchableOpacity onPress={()=> setOfflineData(item,item.trackName)}
                                                              style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                              <Image
                                                                  source={play}
                                                                  style={[styles.icon,{width:22,height:22}]}
                                                              />
                                                          </TouchableOpacity>
                                                      }
                                                    </>
                                                  :
                                                    <TouchableOpacity onPress={()=> {
                                                      startDownload(item,item._id)
                                                      }} style={{justifyContent:'center',top:5,marginLeft:responsiveWidth(2)}}  >
                                                      <Image
                                                          source={download}
                                                          style={[styles.icon,{width:34,height:34,}]}
                                                      />
                                                    </TouchableOpacity>
                                                }
                                              </>
                                            }
  
                                            
                                      {item.progress?
                                          <ActivityIndicator
                                          size={'large'}
                                          style={{position:'absolute',top:1,left:8,right:0,bottom:0}}
                                          color={'white'}
                                          />
                                          :
                                          null
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
                  
                  
            }  
                
            {isplaying?
                <Soundplayer navigation={props.navigation} />
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
    get_allmeditation,set_fav,get_categories
  })(feed);
  