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
import Soundplayer from './trackbanner'
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {get_allmeditation,set_fav,get_categories,storeMedidation,clearData} from '../../redux/actions/meditation';
import {togglePlayer} from '../../redux/actions/validate_player';
import {unloc,pause,play,download,fav,logo,del,cover} from '../../assets'
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
import { firebase } from '@react-native-firebase/messaging';
import * as Animatable from 'react-native-animatable'

var RNFS = require('react-native-fs');


 const feed = (props) => {

    const isFocused = useIsFocused();
    const [localImage,setImage ] =  useState()
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(true)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [item,setitem ] =  useState()
    const [refreshing, setRefreshing] = useState(false);
    const [meditations,setmeditations ] =  useState([])
    const [internal,setInternal ] =  useState([])
    const [category,setcategory ] =  useState([])
    const [localjson,setLocaljson ] =  useState([])
    const [connection,setConnect ] =  useState(false)
    const [once,setOnce ] =  useState(true)
    const [onceConnect,setonceConnect ] =  useState(true)
    const [showLock,setshowLock ] =  useState(false)
    const [subId,setsubId ] =  useState('')
    const [favrt,setfav ] =  useState('no')

    useEffect(() => {
      // console.log("parms =====>",props);
      
      requestToPermissions()
      // if(isFocused){
        setsubId(props?.userData?.subscriptionDetail?.subscriptionId)
        //   // CheckConnectivity()
        setcateEmp(false)
        // setisplaying (false)
        checkInternet()
      // }
      
      // return async () => await props.togglePlayer(false)
      // favrt
    }, [isFocused])

      useEffect(() => {
        
        }, [connection])

    async function checkInternet (){
      // alert("called 2 ")
      NetInfo.fetch().then((state) => {
        // let current = await AsyncStorage.getItem('currentCat')
      // alert('called check internet')
        console.log("Connection type", state.type);
        // console.log("Is connected?", state.isConnected,state.details.ipAddress);
        //if (Platform.OS === "android") {
            // alert(state.isConnected)
            if (state.isConnected) {
            notificationFun()
            get_category()

          } else {
            let cat = '';
            // alert("called 2 ")
            // setcategory([])
            get_category()
            // CheckConnectivity(cat)
          }
        
      });
    }

    const notificationFun = async() =>{

      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
      } else {
        try {
          await firebase.messaging().requestPermission();
        } catch (error) {
        }
      }
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          // console.log("fcmTokenn", fcmToken)
          // console.log('Firebase TOKENnn==> ', fcmToken);
          
        // alert('Firebase TOKEN Upload==> '+ fcmToken);
      } else {
        console.warn('no token');
      }


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
    }

    async function get_category(){
      // console.log("get sub category redux",props?.subCategories?.data);
      if(props?.subCategories?.data != '' && props?.subCategories?.data != undefined){
        var posts = props?.subCategories?.data
          
        var sub_cat = posts.map((item,index)=>{
          if(item.exist === 'yes'){
              return item
            }else{
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
      }else{
        try {
          const res = await props.get_categories();
          var posts = res?.data
          
          var sub_cat = posts.map((item,index)=>{
            if(item.exist === 'yes'){
                return item
              }else{
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
      await props.get_categories()
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
      

      RNFetchBlob.fs.isDir(dir).then((isDir)=>{
        if(isDir){
          RNFS.readDir(dir).then(files => {
            files.map((item)=>{
                filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
            })
            filePath.map(async(item)=>{
              var res = await getLocalJson(ImagePath,item,item.trackName,state,cat)
              meditation.push(res)
            })
            
            if(state.isConnected){
              // alert("called internal medi")
              setTimeout(() => {
                setInternal(meditation)
                let cate = cat;
                let cover = '';
                let resp = []
                getMeditation(state.isConnected,cate,cover,meditation,resp)
                      
              }, 1200);

            }else{
              setTimeout(() => {
                setInternal(meditation)
                let cate = cat;
                let cover = '';
                let resp = []
                getMeditation(state.isConnected,cate,cover,meditation,resp)
                // console.log("HERE++++++++++++++++++++++++++>>>>",meditation)
                // console.log(meditation)
                // setmeditations(meditation)
                // setRefreshing(false);  
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
          setmeditations([])
          let cate = cat;
          let cover = '';
          let resp = []
          getMeditation(state.isConnected,cate,cover,meditation,resp)
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
            // console.log('pared exists')
            meditation = ({
              "_id":pared._id,
              "liked":pared.liked,
              "cat_name":pared.trackCategory.name,
              // "index":pared.posindx,
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
          // alert(JSON.stringify(meditation))
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

    async function getMeditation(state , cate = '',cover = '' , meditation , resp   ) {
        // alert(JSON.stringify(meditation))
        const params = {
            userId: props?.userData?._id
        }
        // console.log("data here",props?.meditationData);
        // alert(connection)
        if(state){
          if(props?.meditationData?.data != '' && props?.meditationData?.data != undefined ){
            try{
              var posts = resp.length != 0 ? resp :  props?.meditationData?.data
              if (posts) {
                  if(cate === ''){
                    // setmeditations(posts)
                    // setTimeout(() => {
                      // alert(1)
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
                        checkData(getFilter,meditation)
                    }
                  }
              }


            } catch (err) {
              setRefreshing(false);
              // alert("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
              console.log(err);
            }
          }else{
            // alert('else')
            try {
              const res = await props.get_allmeditation(params);
              var posts = res?.data
              const data = posts.map((item)=>{
                return {
                    ...item,
                    isplaying: false,
                    progress:false,
                    showLock:false,
                  };
              })
              // await props.storeMedidation(posts)
              // setTimeout(() => {
              //   data.map((item)=>{
              //     console.log(item);
              //   })  
              // }, 5000);
              

              if (data) {
                  if(cate === ''){
                    // setmeditations(posts)
                    // setTimeout(() => {
                      checkData(data,meditation)
                    // }, 1000);
                  }else{
                    setmeditations([])

                    var filtered = []; 
                    data.map((item)=>{
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
        }else{
          let posts = []
          if (meditation) {
            if(cate === ''){
              // setmeditations(posts)
              // setTimeout(() => {
                checkData(posts,meditation)
              // }, 1000);
            }else{
              setmeditations([])

              var filtered = []; 
              meditation.map((item)=>{
                  filtered.push(item)
              })
            
              let getFilter = [];
              setcateEmp(false)

              filtered.map((item)=>{
                // let str =item.trackCategory 
                // let str2 = str.charAt(0).toUpperCase() + str.slice(1)
                // console.log(item.trackCategory.name === cate)
                  if(item.cat_name === cate){
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
          // checkData(posts,meditation)
        }
        await props.get_allmeditation(params)

    }

    async function checkData(posts,meditation){
      // alert(JSON.stringify(meditation))
      if(meditation.length > 0  ){
        
        let trueData = [];
        let fasleData = [];
        // console.log(posts._id);
        posts.map((item,index)=>{
          meditation.filter((child,indx)=>{
            // console.log(index,key);
            // console.log(item._id,child._id);
            if(item._id === child._id){
              trueData.push({...item,isdownloading:true})
            }
            else{
              fasleData.push({...item,isdownloading:false})
            }
          })
        })
        // alert(JSON.stringify(trueData)) 
      // return

        var ids = new Set(trueData.map(d => d._id));
        var merged = [...trueData, ...fasleData.filter(d => !ids.has(d._id))];
        
        
        // console.log("id====>",merged._id)
        // let dub=finalData;
        const n = merged.filter((tag, index, dub) =>
        dub.findIndex((t)=> t._id === tag._id
        ) == index);

        
        var res = posts.map(obj => n.find(o => o._id === obj._id) || obj);
        // return res.map(item =>  console.log(item.posindx))
        
        // n.map(item =>  console.log(item.key))

        setmeditations(res);
        setRefreshing(false);
      }else{
        // alert("where are you")
        // await props.storeMedidation(n)
        // alert(2)

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
          trackType: "Meditation",
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
          // if (res?.data === "Done: Add to Favorites") {
            if (res?.data) {
              console.log(res?.data)
              setfav('yes')
              if(props?.meditationData?.data != '' && props?.meditationData?.data != undefined ){
                const id = {
                  userId: props?.userData?._id
                }
                var resp = await props.get_allmeditation(id)
                // setTimeout(() => {
                  // console.log("resp dta",resp?.data);
                  let cat = item.trackCategory.name;
                  
                  let cover = '';
                  let medi = internal
                  getMeditation(connection,cat,cover,medi,resp?.data)  
                // }, 1000);
                
              }else{
                // const id = {
                //   userId: props?.userData?._id
                // }
                // await props.get_allmeditation(id)
                let cat = item.trackCategory.name;
                let cover = '';
                let medi = internal;
                let resp = []
                getMeditation(connection,cat,cover,medi,resp)
              }
              
          }
          // else{
          //   setfav('no')

          // }
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
        // setisplaying(false)
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
                let resp = []
                // console.log(item);
                setRefreshing(true)
                  getMeditation(connection,item.name,item.coverPic,medi,resp)
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

    function setoff(state,id){

      if(state === 1){
        const res = meditations.map((item)=>{
        // alert('closed')
        // console.log(item._id === id)
          if(item){
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
    }else if(state === 2){
      const res = meditations.map((item)=>{
        // alert('closed')
        // console.log(item._id === id)
          if(item._id === id){
              return {
                  ...item,
                  isplaying: true,
                };
          } else {
              return {
                  ...item,
                  // isplaying: false,
                };
          }
      })
      setmeditations(res)
      // alert('resumed')
    }else if(state === 3){
      const res = meditations.map((item)=>{
        // alert('closed')
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
      // alert('paused')
    }else{

    }
      
    } 

    const setData = async (single,id) => {
        // console.log(item.trackName)
        await props.togglePlayer(false)
        setisplaying(false)
          setTimeout(async() => {
            if(single.isplaying ){
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
                await props.togglePlayer(false)
    
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
                await props.togglePlayer(true)
    
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
      await props.togglePlayer(false)
      
        setTimeout(async() => {
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
              await props.togglePlayer(false)
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
              await props.togglePlayer(true)
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
                progress:false,
                // isdownloading:true,
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
        console.log(e)
      }
    }


    async function deletefile(item,traname,index){
      // return console.log(item);
      let name = item.trackName;
      let id = item._id;
      try {
          await AsyncStorage.removeItem(name);
          // alert('cleared item')
          // return true;
      }
      catch(exception) {
        console.log(exception)
          // return false;
      }
      // return
      setisplaying(false)
      // let name = item.trackName;
      let cover = name.concat("_img");
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
      // setTimeout(() => {
        if(connection){
        //   const res = meditations.map((post)=>{
        //     if(post._id === id){
        //       return {
        //         ...post,
        //         isdownloading:false,
        //       }
        //     }else{
        //       return {
        //         ...post,
        //       }
        //     }
        // })
        //   setmeditations(res)
          CheckConnectivity(item.trackCategory.name)
        }else{
          let cate = ''
          // const res = meditations.splice(index,1)
          // setmeditations(res)          
          CheckConnectivity(cate)
        }
      // }, 500);
   

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
                source={cover}
                style={styles.imgBackground}
            >
              {/* <TouchableOpacity style={{alignItems:'center'}} onPress={async()=> await props.clearData() } > */}
                <Text style={styles.title}>MEDITATION</Text>
              {/* </TouchableOpacity> */}
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
                  <Animatable.View
                      animation={'fadeInRight'}
                      // duration={500}
                      delay={index*300}
                      // style={{width:'46.8%',margin:6,alignItems:'center'}}
                    >
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
                  </Animatable.View>
                  }/>
            </ImageBackground>
            {cateEmp?
                  <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                      <Text style={styles.title} >Your selected category is empty</Text>
                  </View>
                  :
                  <>
                    {refreshing?
                      <View style={{flex:1}} />
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
                            // refreshControl={
                            //   <RefreshControl refreshing={refreshing} onRefresh={CheckConnectivity} />
                            // }
                              style={{width:'100%',height:'100%',flex:1}}
                              numColumns={'2'}
                              // keyExtractor={(item) => item.id}
                              showsVerticalScrollIndicator={false}
                              data={meditations}
                              renderItem={({ item, index }) =>
                                  // <Animatable.View
                                  //       animation={'fadeInDownBig'}
                                  //       // duration={500}
                                  //       delay={index*300}
                                  //       // style={{width:'46.8%',margin:6,alignItems:'center'}}
                                  //     >
                                    <View style={{width:Dimensions.get('window').width / 2 - 12,margin:6,alignItems:'center'}}>
                                      
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
                                              {item.subscriptionType.includes(subId)?
                                              
                                              <>
                                                {item.isdownloading?
                                                  // <TouchableOpacity onPress={()=> connection? alert('online') : alert('offonline') } 
                                                  // <>
                                                  // {favrt === 'no'?
                                                    <TouchableOpacity onPress={()=> favourities(item)  } 
                                                    // style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}
                                                    style={{height:40}}
                                                    >
                                                        <View style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]} >
                                                          <Image
                                                              source={fav}
                                                              style={[styles.icon,{
                                                                tintColor: item.liked === 'no'? 'white' :'#FF4040'
                                                                // tintColor:  'white'
                                                              }]}
                                                          />
                                                        </View>
                                                        
                                                    </TouchableOpacity>
                                                //   :
                                                //     <TouchableOpacity onPress={()=> favourities(item)  } 
                                                //     // style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}
                                                //     style={{height:40,backgroundColor:'orange'}}
                                                //     >
                                                //         <View style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]} >
                                                //           <Image
                                                //               source={fav}
                                                //               style={[styles.icon,{
                                                //                   tintColor: '#FF4040'
                                                //               }]}
                                                //           />
                                                //         </View>
                                                        
                                                //     </TouchableOpacity>
                                                //   }
                                                // </>
                                                :
                                                null}
                                              
                                              </>
                                              :
                                              null}
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
                                            <>
                                            {item.subscriptionType.includes(subId)?
                                              
                                              <>
                                                {item.isdownloading?
                                                  <TouchableOpacity onPress={()=>{deletefile(item,item.trackName,index)}}  style={{height:40}} >
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
                                              :
                                              null
                                              }
                                            </>
                                              :
                                            <>
                                                {item.isdownloading?
                                                  <TouchableOpacity onPress={()=>{deletefile(item,item.trackName,index)}}  style={{height:40}} >
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
                                        <View style={{flex:0.4}}><Text>{item.isdownloading}</Text></View>
                                        <View style={{flex:0.25,alignItems:'center'}} >
                                            {connection?

                                              <>
                                              {item.subscriptionType.includes(subId)?
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
                                              :
                                              <TouchableOpacity onPress={()=> 
                                                    props.navigation.navigate('Packages')
                                                }
                                                style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                    <Image
                                                        source={unloc}
                                                        style={[styles.icon,{width:15,height:19}]}
                                                    />
                                                </TouchableOpacity> 
                                              }
                                              </>
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
                                          {showLock?
                                          <TouchableOpacity onPress={()=> 
                                                  props.navigation.navigate('Packages')
                                              }
                                              style={[styles.iconBackground,{width:34,height:34,top:5}]}>
                                                  <Image
                                                      source={unloc}
                                                      style={[styles.icon,{width:15,height:19}]}
                                                  />
                                              </TouchableOpacity>  
                                          :null}
                                              
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
                                  // </Animatable.View>
                              }
                          />
                        } 
                      </>
                    }
                  </>
                  
                  
            }  
                
            {props?.val?
                // <TouchableOpacity onPress={()=>setoff()} >
                  <Soundplayer navigation={props.navigation} setoffpalying = {(state,id)=>setoff(state,id)} />
                // </TouchableOpacity>
                    // null
                :
            null}   

        </View>
    )
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    const {val} = state.validatePlayer;
    const {meditationData,subCategories} = state.meditations
    return {
      userData,val,meditationData,subCategories
    };
  };
  export default connect(mapStateToProps, {
    get_allmeditation,set_fav,get_categories,togglePlayer,storeMedidation,clearData
  })(feed);
  