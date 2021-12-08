import React,{useState,useEffect} from 'react'
import {View,Text,PermissionsAndroid,ActivityIndicator,RefreshControl,ImageBackground,Image,FlatList} from 'react-native'
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
import {get_allStories,set_fav,get_categories} from '../../redux/actions/stories';
import {connect} from 'react-redux';
import {unloc,pause,play,download,fav,logo,del,stories} from '../../assets'
import Soundplayer from './playing'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
import NetInfo from "@react-native-community/netinfo";
var RNFS = require('react-native-fs');


    const story = (props) => {

    const [selected,setSelected ] =  useState(false);
    const [isplaying,setisplaying ] =  useState(false);
    const isFocused = useIsFocused();
    const [item,setitem ] =  useState();
    const [meditations,setmeditations ] =  useState([]);
    const [internal,setInternal ] =  useState([])
    const [refreshing, setRefreshing] = useState(true);
    const [category,setcategory ] =  useState([])
    const [connection,setConnect ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [localImage,setImage ] =  useState()
    const [subId,setsubId ] =  useState('')

    useEffect(() => {
        setsubId(props?.userData?.subscriptionDetail?.subscriptionId)
        checkInternet()
        setcateEmp(false)
        // setisplaying (false)
        requestToPermissions()

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

    async function get_category(){
      try {
        const res = await props.get_categories();
        var posts = res?.data
        
        var sub_cat = posts.map((item,index)=>{
          if(item.exist){
            if(item.exist === 'yes'){
              return item
            }
          }
        })
        
        sub_cat = sub_cat.filter(function( element ) {
          return element !== undefined;
       });


        var rest = sub_cat.map((item,index)=>{
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
      // setisplaying(false)
      setRefreshing(true);
      // For Android devices
      NetInfo.fetch().then((state) => {
        setConnect(state.isConnected)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected,state.isInternetReachable);
        //if (Platform.OS === "android") {
          if (state.isConnected) {
            getFiles(state,cat)
          } else {
            getFiles(state,cat)
            // Snackbar.show({
            //   text: 'You are not Connected to Internet, Continuing Offline!',
            //   backgroundColor: '#018CAB',
            //   textColor: 'white',
            // });
          }
        
      });
    };

    function getFiles(state,cat){
      let dir = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
      let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'
      var meditation = [];
      var filePath = [];
      var ImagePath = '' ;


      RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(Imgdir).then(files => {
            files.map((item)=>{
              if(item.name === "Stories"){
                ImagePath = item.path

                setImage(item.path)
              // return console.log(files);
            }
            })
          })
        }
      })
      
      RNFetchBlob.fs.isDir(dir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(dir).then(files => {
            // return console.log(files[0].isFile)
            files.map((item)=>{
              // console.log(item)  
              // if(item.name.includes("_img")){
              //     ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
              // }else{
                  filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
              // }
              // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
            })
            filePath.map(async(item)=>{
              // ImagePath.map(async(img)=>{
              //   if(item.trackName === img.name){
                  var res = await getLocalJson(ImagePath,item,item.trackName,state,cat)
                  // return console.log("local===========>",res);
                  meditation.push(res)
                  // meditation.push({"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,exists:true})
              //   }
              // })
            })
            // meditation = [{...filePath,...ImagePath}]
            // console.log("????????????????????????????????????????")
            if(state.isConnected){
              console.log(meditation)
              // alert("called internal medi")
              setInternal(meditation)
              let cate = cat
              let cover = ''
              getStories(cate,cover,meditation)
    
            }else{
              setTimeout(() => {
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
          //   textColor: 'tomato',
          // });
              let cate = cat
              let cover = '';
          let meditation = []
          getStories(cate,cover,meditation)
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
            meditation = ({
              "_id":pared._id,
              "liked":pared.liked,
              "cat_name":pared.trackCategory.name,
              "trackType": pared.trackType,
              "trackFile":item.trackFile,
              "trackName":item.trackName,
              isdownloading:item.isdownloading,
              "coverPic":img,
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
              isdownloading:item.isdownloading,
              "coverPic":img,
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

    async function getStories(cate = '',cover = '',stories) {
        const params = {
            userId: props?.userData?._id
        }
        try {
          const res = await props.get_allStories(params);
          var posts = res?.data

          posts.map((item)=>{
            return {
                ...item,
                isplaying: false,
                progress:false
              };
          })
          if (posts) {
            if(cate === ''){
              // setmeditations(posts)
              checkData(posts,stories)

            }else{
              //   alert('calling cate')
              setmeditations([])

              var filtered = []; 
              setcateEmp(false)

              posts.map((item)=>{
                  filtered.push(item)
              })
             
              var getFilter = [];

              filtered.map((item)=>{
                // console.log(item.trackCategory === cate)
                  if(item.trackCategory.name === cate){
                      getFilter.push(item);
                  }else{
                      return
                  }
              })
              if(getFilter.length < 1){
                  
                setcateEmp(true)
                setmeditations([])
              }else{
                  checkData(getFilter,stories)
              }

            }
        }
        //   setloadingGroup(false);
        } catch (err) {
          setRefreshing(false);
        //   setloadingGroup(false);
          console.log(err);
        }
        // if (props?.all_group_data) {
        //   setgroupDetail(props?.all_group_data[0]);
        // }
      }

      function checkData(posts,stories){
        console.log("&^&^&^&^&^&^&^&^&^&^&^&^&^^&^&^^")
        if(stories.length > 0){
          let trueData = [];
          let fasleData = [];
          // console.log(posts.length);
          posts.map(item=>{
            stories.filter(child=>{
              // console.log(item._id)
              // console.log(item.trackName +"%%%%%%%%%%%%%%%%%%%%%%%%%%"+ child.trackName)
              if(item.trackName === child.trackName){
                trueData.push({...item,isdownloading:true})
              }else{
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
          setmeditations(n);
          setRefreshing(false);
        }else{
          setmeditations(posts);
          setRefreshing(false);
        }
       
  
      }
      
      async function  favourities(item){
        //   console.log("user id "+props?.userData?._id);
        setofflinefav(item)

        if(connection){
        const params = {
            trackId: item._id,
            trackType: "Stories",
            trackName: item.trackName,
            trackFile:item.trackFile,
            coverPic:item.trackCategory.coverPic,
            userId:props?.userData?._id
          };
            // console.log(params)
          try {
            const res = await props.set_fav(params);
            // console.log('group_data', res);
            if (res?.data) {
                console.log(res?.data)
                let cat = item.trackCategory.name;
                let cover = '';
                let story = internal;
                getStories(cat,cover,story)
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
                const    res = category.map((item) => {
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
            const res = category.map((item) => {
                if (item._id === id) {
                  // console.log('Item-image==>',item.loadimage)
                //   alert(item.name)
                let story = internal
                setRefreshing(true)
                getStories(item.name,item.coverPic,story)
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

    const setData = async (single,id,name) => {
      // console.log(item.trackName)
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
      
      
          try {
              await AsyncStorage.setItem("single_item",JSON.stringify({...single,type:'Stories'}))
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
      var res = meditations.map((post)=>{
        if(post._id === item._id){
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
      // const {tunes, token, currentTrackIndex} = this.state;
      let url  = item.trackFile;
      let name  = item.trackName;
      // let coverUrl  = item.trackCategory.coverPic;

      // let dis = RNFetchBlob.fs.dirs
      // return console.log(dis.DownloadDir)

      const FolderPAth = '/storage/emulated/0/Download/FourRelax';
      const tracktype = '/storage/emulated/0/Download/FourRelax/stories'
    try{
    RNFetchBlob.fs.isDir(FolderPAth).then((isDir)=>{
      if(isDir){
        //  alert('exist')
        RNFetchBlob.fs.isDir(tracktype).then((isDir)=>{
          if(isDir){
            // alert('exist medii')
            let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                console.log(res);
                console.log('The file is save to ', res.path());
              });
              // RNFetchBlob.config({
              //   fileCache: true,
              //   appendExt: 'jpg',
              //   addAndroidDownloads: {
              //     useDownloadManager: true,
              //     notification: false,
              //     title: name+"_img",
              //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
              //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
              //     description: 'Image',
              //   },
              // })
              //   .fetch('GET', coverUrl)
              
              //   .then(res => {
              //     console.log(res);
              //     console.log('The file is save to ', res.path());
              //   });
          }else{
            RNFetchBlob.fs.mkdir(tracktype).then(()=>{
              // alert('newly create medi')
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                console.log(res);
                console.log('The file is save to ', res.path());
              });
              // RNFetchBlob.config({
              //   fileCache: true,
              //   appendExt: 'jpg',
              //   addAndroidDownloads: {
              //     useDownloadManager: true,
              //     notification: false,
              //     title: name+"_img",
              //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
              //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
              //     description: 'Image',
              //   },
              // })
              //   .fetch('GET', coverUrl)
              
              //   .then(res => {
              //     console.log(res);
              //     console.log('The file is save to ', res.path());
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
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                  console.log(res);
                  console.log('The file is save to ', res.path());
                });
                // RNFetchBlob.config({
                //   fileCache: true,
                //   appendExt: 'jpg',
                //   addAndroidDownloads: {
                //     useDownloadManager: true,
                //     notification: false,
                //     title: name+"_img",
                //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
                //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                //     description: 'Image',
                //   },
                // })
                //   .fetch('GET', coverUrl)
                
                //   .then(res => {
                //     console.log(res);
                //     console.log('The file is save to ', res.path());
                //   });
            }else{
              RNFetchBlob.fs.mkdir(tracktype).then(()=>{
                // alert('newly create medi')
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                  console.log(res);
                  console.log('The file is save to ', res.path());
                });
                // RNFetchBlob.config({
                //   fileCache: true,
                //   appendExt: 'jpg',
                //   addAndroidDownloads: {
                //     useDownloadManager: true,
                //     notification: false,
                //     title: name+"_img",
                //     path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
                //     // path: RNFetchBlob.fs.dirs.DownloadDir + `${name}`, // Android platform
                //     description: 'Image',
                //   },
                // })
                //   .fetch('GET', coverUrl)
                
                //   .then(res => {
                //     console.log(res);
                //     console.log('The file is save to ', res.path());
                //   });
              })
            }
          })
      })
      }
      })
    }catch(e){alert(e)}
      setItemData(item)

      setTimeout(() => {
      const res = meditations.map((post)=>{
          if(post._id === item._id){
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
      
      
      
          // await AsyncStorage.setItem("")

    };

    async function deletefile(item,traname){
      setisplaying(false)
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
      let cover = name.concat("_img");
      // return console.log(cover)
      let dir = RNFS.DownloadDirectoryPath + '/FourRelax/stories/' + name; 
      let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/stories/' + cover;
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

    async function offlineFav(sing){
      // console.log(meditations);
      try{
        if(sing.liked == 'yes'){
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
      if(rep.liked === 'yes'){
        addRemoveFav(item)
        rep = ({...rep,liked : 'no'})
      }else{
        addRemoveFav(item)
        rep = ({...rep,liked : 'yes'})
      }
      console.log(rep.liked);
      await AsyncStorage.setItem(name,JSON.stringify(rep))
     
    }

    async function  setItemData(item){
      try{
        let name = item.trackName
        await AsyncStorage.setItem(name,JSON.stringify(item))
        // alert("set item successfully")
      }catch(e){
        alert(e)
      }
    }

    async function addRemoveFav(post){
      if(post.liked != 'yes'){
          let dir = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
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
                            <TouchableOpacity  onPress={()=> getcate(item,item._id) } >
                                <Text style={{color:'black'}}>{item.name}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                      :
                      <TouchableOpacity  onPress={()=> getcate(item,item._id) } style={[styles.cate,{backgroundColor:'white'}]}>
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
                      <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}} />
                    :
                    <>
                    { meditations.length < 1  ?
                    <>
                      {connection?
                        <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                          <Text style={styles.title} >Story List is empty</Text>
                        </View>
                      :
                      <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                          <Text style={styles.title} >No local data found</Text>
                      </View>
                      }
                    </>
                        
                    :
                    <FlatList
                          // refreshControl={
                          //   <RefreshControl refreshing={refreshing} onRefresh={CheckConnectivity} />
                          // }
                          style={{width:'100%'}}
                          numColumns={'2'}
                          showsVerticalScrollIndicator={false}
                          data={meditations}
                          renderItem={({ item, index }) =>
                              <View style={{width:'46.8%',margin:6,alignItems:'center'}}>
                                  <ImageBackground
                                      source={{uri : 'file://' + localImage}} 
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
                                          {!item.subscriptionType.includes(subId)?
                                              null
                                            :
                                            <>
                                              {item.isdownloading?
                                                <TouchableOpacity onPress={()=> favourities(item)}  style={{height:40}} >
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
                                            </>
                                            }
                                          </>
                                          :
                                          <>
                                            {item.isdownloading?
                                              <TouchableOpacity onPress={()=> offlineFav(item)}  style={{height:40}} >
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
                                          </>
                                          }
                                          </View>
                                          <View style={{flex:0.8,alignItems:'flex-end'}}>
                                          {connection?
                                            <>
                                            {!item.subscriptionType.includes(subId)?
                                                null
                                              :
                                              <>
                                                {item.isdownloading?
                                                  <TouchableOpacity onPress={()=>{deletefile(item,item.trackName)}}  style={{height:40}} >
                                                      <View style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]} >
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
                                            </>
                                          :
                                            <>
                                              {item.isdownloading?
                                                <TouchableOpacity onPress={()=>{deletefile(item,item.trackName)}}  style={{height:40}} >
                                                    <View style={[styles.iconBackground,{marginRight:16,top:12,alignSelf:'center'}]} >
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
                                      <View style={{flex:0.25,width:'100%',alignItems:'center'}} >
                                        {connection?
                                          <>
                                          {!item.subscriptionType.includes(subId)? 
                                              <TouchableOpacity onPress={()=> 
                                                  props.navigation.navigate('Packages')
                                              }
                                              style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                  <Image
                                                      source={unloc}
                                                      style={[styles.icon,{width:15,height:19}]}
                                                  />
                                              </TouchableOpacity>
                                                :
                                                <>
                                                {item.isdownloading?
                                                    <>
                                                      {item.isplaying?
                                                          <TouchableOpacity onPress={()=> setData(item,item._id,item.trackName)} 
                                                          style={[styles.iconBackground,{width:34,height:34,top:5}]}>
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
                                          </>
                                          :
                                          <>
                                            {item.isdownloading?
                                                <>
                                                  {item.isplaying?
                                                      <TouchableOpacity onPress={()=> setData(item,item._id,item.trackName)} 
                                                      style={[styles.iconBackground,{width:34,height:34,top:5}]}>
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
    get_allStories,set_fav,get_categories
  })(story);