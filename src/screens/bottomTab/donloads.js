import React,{useState,useEffect} from 'react'
import {View,Text,ImageBackground,RefreshControl,PermissionsAndroid,Image,ActivityIndicator,FlatList,Switch} from 'react-native'
import {feed,pause,play,fav,del,left,music,explore} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Header, FAB} from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob'
var RNFS = require('react-native-fs');
import styles from './styles'
import {useIsFocused} from '@react-navigation/native';
import Soundplayer from './trackbanner'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import theme from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {togglePlayer} from '../../redux/actions/validate_player';
import * as Animatable from 'react-native-animatable'


 function downloads(props) {

    const isFocused = useIsFocused();
    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [item,setitem ] =  useState()
    const [meditations,setmeditations ] =  useState([])
    const [refreshing, setRefreshing] = useState(true);
    const [connection,setConnect ] =  useState(false)
    const [internal,setInternal ] =  useState()
    const [localImage,setImage ] =  useState()

    useEffect(() => {
        getfile()
    }, [isFocused])

    function getfile (){
      
        setisplaying (false)
        // setRefreshing(true)
        let dirs = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
        let dirso = RNFS.DownloadDirectoryPath + '/FourRelax/sounds'
        let dirm = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
        let Imgdir = RNFS.DownloadDirectoryPath + '/FourRelax/mainImages'

        let meditation = []
        let sounds = [];
        let stories = [];
        let final = [];
        let filePath = [];
        let MediImage = '';
        let StoryImage = '';
        let SoundImage = '';

        RNFetchBlob.fs.isDir(Imgdir).then((isDir)=>{
          if(isDir){
            RNFS.readDir(Imgdir).then(files => {
              files.map((item)=>{
                if(item.name === "Meditation"){
                  MediImage = item.path
                  // setImage(item.path)
                // return console.log(files);
                }else if(item.name === "Sounds"){
                  SoundImage = item.path
                }else{
                  StoryImage = item.path
                }
              })
            })
          }
        })

       
        RNFetchBlob.fs.isDir(dirm).then((isDir)=>{
          if(isDir){
            
            RNFS.readDir(dirm).then(files => {
              // return console.log(files[0].isFile)
              files.map((item)=>{
                // console.log(item)  
                // if(item.name.includes("_img")){
                //   ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                // }else{
                  filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true,"type":'meditation'})
                // }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
              })
              filePath.map(async(item)=>{
                // ImagePath.map((img)=>{
                //   if(item.trackName === img.name){
                  var res = await getLocalJson(MediImage,item,item.trackName)
                  console.log("local donloads===========>",res);
                  meditation.push(res)
                  // meditation=(res)
                    // meditation = ({id:Math.floor(Math.random() * 10),'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                  // }
                // })
              })
              setTimeout(() => {
                if(meditation.length < 1){
                // if(Object.keys(meditation).length === 0){
                // console.log("***********true****************",meditation);
                    // alert('true')
                }else{
                  // final.push({meditation})
                  meditation.map((item)=>{
                    final.push(item)
                  })
                  // console.log("************fale***************",meditation);
                    // alert('false')
                }
                // console.log("***************************",meditation);
              }, 1000);

          
            
            }).catch(err => {
              // setRefreshing(false);
              console.log(err.message, err.code);
            });

            
          }
        })

        RNFetchBlob.fs.isDir(dirso).then((isDir)=>{
            if(isDir){
              
              RNFS.readDir(dirso).then(files => {
                // return console.log(files[0].isFile)
                files.map((item)=>{
                  // console.log(item)  
                  // if(item.name.includes("_img")){
                  //   ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                  // }else{
                    filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true,"type":'sound'})
                  // }
                  // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
                })
                filePath.map(async(item)=>{
                  // ImagePath.map((img)=>{
                  //   if(item.trackName === img.name){
                  var res = await getLocalJson(SoundImage,item,item.trackName)
                  // console.log("local===========>",res);
                  sounds.push(res)
                  // sounds=(res)
                        // sounds = ({id:Math.floor(Math.random() * 10),'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                  //   }
                  // })
                })
                setTimeout(() => {
                  if(sounds.length < 1){
                    // if(Object.keys(sounds).length === 0){
                    // console.log("***********true****************",meditation);
                        // alert('true')
                    }else{
                      // final.push(sounds)
                      sounds.map((item)=>{
                        final.push(item)
                      })
                      // console.log("************fale***************",meditation);
                        // alert('false')
                    }
                  // final.push(sounds)
                  // console.log("***************************",meditation);
                }, 1200);
             
              }).catch(err => {
                // setRefreshing(false);
                console.log(err.message, err.code);
              });
  
              
            }
          })


        RNFetchBlob.fs.isDir(dirs).then((isDir)=>{
        if(isDir){
            
            RNFS.readDir(dirs).then(files => {
            // return console.log(files[0].isFile)
            files.map((item)=>{
                // console.log(item)  
                // if(item.name.includes("_img")){
                // ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                // }else{
                filePath.push({"trackFile":item.path,"type":'story',"trackName":item.name,isdownloading:true,exists:true})
                // }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
            })
            filePath.map(async(item)=>{
                // ImagePath.map((img)=>{
                // if(item.trackName === img.name){
                  var res = await getLocalJson(StoryImage,item,item.trackName)
                  // console.log("local===========>",res);
                  // stories=(res)
                  stories.push(res)
                    // stories = ({id:Math.floor(Math.random() * 10),'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                // }
                // })
            })
            setTimeout(() => {
              if(stories.length < 1){
                // if(Object.keys(stories).length === 0){
                // console.log("***********true****************",meditation);
                    // alert('true')
                }else{
                  // final.push(stories)
                  stories.map((item)=>{
                    final.push(item)
                  })
                  
                  // console.log("************fale***************",meditation);
                    // alert('false')
                }
              // final.push(stories)
              // console.log("***************************",meditation);
            }, 1400);
            // meditation = [{...filePath,...ImagePath}]
            // setmeditations(stories)
            // final.push(stories)

            // console.log("?????????????????????stories???????????????????")
            // console.log(stories)
            
            }).catch(err => {
            // setRefreshing(false);
            console.log(err.message, err.code);
            });

            
        }
        })
        // console.log("***************************",meditation);
        // var names = new Set(meditation.map(d => d.trackName));
        // var merged = [...meditation, ...sounds.filter(d => !names.has(d.trackName))];
        // final.push({...meditation,sounds,stories})

        // var names2 = new Set(merged.map(d => d.trackName));
        // var merged2 = [...merged, ...stories.filter(d => !names2.has(d.trackName))];
        // const n = final.filter((tag, index, dub) =>
        // dub.findIndex((t)=> t.trackName === tag.trackName
        // ) == index);
        
        // n.map((item)=>{
        //   item.map((data)=>{
        //     alert("##################======>",data);

        //   })
        // })

        setTimeout(() => {
        console.log("+++++++++++++++++++++++++++++++++++++")
        // return console.log(final)
        const n = final.filter((tag, index, dub) =>
        dub.findIndex((t)=> t._id === tag._id ) == index);
        setmeditations(n)
        // return console.log(n)
        
        }, 1600);
        setTimeout(() => {
          setRefreshing(false)
        }, 1650);

    }

    async function getLocalJson (img,item,name){
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

    const setData = async (single,id) => {
        // console.log(item.trackName)
        await props.togglePlayer(false)
        setisplaying(false)
        setTimeout(async() => {
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
        
        
            try {
                await AsyncStorage.setItem("single_item",JSON.stringify(single))

            } catch (e) {
             console.log("calling itself"+e)
            }
        // alert('called set data')
                
                // var data = await AsyncStorage.getItem("single_item")
                // console.log(JSON.parse(data).trackName) 
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

    async function deletefile(item,traname,type,index){
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

        if(type === 'Meditation'){
            let name = item.trackName;
            // return console.log(cover)
            let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + name; 
            try{
              let exists = await RNFS.exists(dir);
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
        }else if(type === 'Sounds'){
            let name = item.trackName;
            // return console.log(cover)
            let dir = RNFS.DownloadDirectoryPath + '/FourRelax/sounds/' + name; 
            try{
              let exists = await RNFS.exists(dir);
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
        }else{
            let name = item.trackName;
            // return console.log(cover)
            let dir = RNFS.DownloadDirectoryPath + '/FourRelax/stories/' + name; 
            try{
              let exists = await RNFS.exists(dir);
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
        if(item.liked === "yes"){
          // alert('called')
          addRemoveFav(item)
          // favourities(item)
        }
        // setTimeout(() => {
          getfile()
        // }, 1500);
        // alert(index)
        // const res = meditations.splice(index,1)
        //   setmeditations(res) 
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

      async function addRemoveFav(post){
        if(post.liked != 'yes'){
            let dirm = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'
            let dirst = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
            let dirso = RNFS.DownloadDirectoryPath + '/FourRelax/sounds'
            let desPath = RNFS.DownloadDirectoryPath + '/FourRelax/favourties'
            const favPath = '/storage/emulated/0/Download/FourRelax/favourties'
            let meditation = [];
            var filePath = [];
            var ImagePath = [];
            let local = [];
            if(post.trackType === 'Meditation'){
              RNFetchBlob.fs.isDir(dirm).then((isDir)=>{
                // return console.log(isDir);
                if(isDir){
                  RNFS.readDir(dirm).then(files => {
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
            }else if(post.trackType === 'Sounds'){
              RNFetchBlob.fs.isDir(dirso).then((isDir)=>{
                // return console.log(isDir);
                if(isDir){
                  RNFS.readDir(dirso).then(files => {
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
              RNFetchBlob.fs.isDir(dirst).then((isDir)=>{
                // return console.log(isDir);
                if(isDir){
                  RNFS.readDir(dirst).then(files => {
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
      // <View style={{flex:1}}>

        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
            style={{flex:1}}>
            {/* <Header
                backgroundColor="red"
                containerStyle={{
                alignSelf: 'center',
                // height: ,
                marginTop:20,
                borderBottomWidth: 0,
                // borderBottomColor: '#E1E3E6',
                }}
                leftComponent={
                    
                    
                }
                centerComponent={
                    <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >DOWNLOADS</Text>
                }
            /> */}
            <View style={{height:45,alignItems:'center',flexDirection:'row'}} >
                <View style={{flex:0.15,alignItems:'center'}} >
                <TouchableOpacity style={{width:30,height:30,justifyContent:'center',alignItems:'center'}} onPress={()=> props.navigation.goBack()} >
                        <Image
                            source={left}  
                            style={{width:7,height:14,tintColor:'white'}}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,alignItems:'center'}} >
                  <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff',marginRight:responsiveWidth(12)}} >DOWNLOADS</Text>
                </View>
            </View>
            <View style={{alignItems:'center',width:'90%',height:'88%',alignSelf:'center'}}>
            {refreshing?
              <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}/>
            :
            <>
                {meditations.length < 1?
                    <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.title} >Empty</Text>
                    </View>
                :
                <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={getfile} />
                        }
                        style={{width:'100%'}}
                        showsVerticalScrollIndicator={false}
                        data={meditations}
                        renderItem={({ item, index }) =>
                          <Animatable.View
                            animation={'fadeInRight'}
                            duration={500}
                            delay={index*200}
                            // style={{width:'46.8%',margin:6,alignItems:'center'}}
                          >
                            <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                                    style={styles.setting_btn}
                                    >
                                    <View   style={{flexDirection:'row',height:50,flex:1,alignItems:'center'}}>
                                        
                                      <View style={{flexDirection:'row',alignItems:'center',flex:0.4}} >
                                        {item.isplaying?
                                            <TouchableOpacity style={{marginLeft:responsiveWidth(3),marginTop:responsiveHeight(2),width:30,height:30,borderRadius:50,alignItems:'center'}} onPress={()=> setData(item,item._id)} >
                                                <Image
                                                    source={pause}
                                                    style={[styles.icon,{width:22.67,height:22.67}]}
                                                />
                                            </TouchableOpacity>
                                            :
                                            
                                            <TouchableOpacity style={{marginLeft:responsiveWidth(3),marginTop:responsiveHeight(2),width:30,height:30,borderRadius:50,alignItems:'center'}} onPress={()=> setData(item,item._id)}
                                                >
                                                <Image
                                                    source={play}
                                                    style={[styles.icon,{width:22,height:22}]}
                                                />
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity onPress={()=>offlineFav(item)} style={{marginLeft:responsiveWidth(5.5),marginTop:responsiveHeight(2),width:30,height:30,borderRadius:50,alignItems:'center'}} >
                                            <Image
                                                source={fav}
                                                style={{width:22,height:19,tintColor:'#FF4040',tintColor:item.liked  === 'no'? 'white' :'#FF4040'}}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{width:30,height:30,borderRadius:50,alignItems:'center',marginTop:responsiveHeight(2),marginLeft:responsiveWidth(5.5)}} onPress={()=>{deletefile(item,item.trackName,item.trackType,index)}}>
                                            <Image
                                                source={del}
                                                style={{width:17,height:18}}
                                            />
                                        </TouchableOpacity>
                                      </View>
                                      <View style={{alignItems:'flex-end',flex:0.6}} >
                                        <View style={{flexDirection:'row',alignItems:'center',marginRight:responsiveWidth(10)}} >
                                          {item.trackType === 'Meditation'?
                                              <>
                                                  <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),color:theme.colors.primary}} >{item.trackName}</Text>
                                                  <Image
                                                      source={feed}
                                                      style={{width:21,height:19,left:responsiveWidth(8)}}
                                                  />
                                              </>
                                          :
                                              <>
                                              {item.trackType === 'Sounds'?
                                                  <>
                                                      <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),color:theme.colors.primary}} >{item.trackName}</Text>
                                                      <Image
                                                          source={music}
                                                          style={{width:15,height:32,left:responsiveWidth(8),marginRight:responsiveWidth(1)}}
                                                      />
                                                  </>
                                              :
                                              <>
                                                <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),color:theme.colors.primary}} >{item.trackName}</Text>
                                                <Image
                                                    source={explore}
                                                    style={{width:21,height:19,left:responsiveWidth(8)}}
                                                />
                                              </>
                                              }
                                              </>
                                          }
                                        </View>
                                    </View>
                                  </View> 

                            </LinearGradient>
                          </Animatable.View>
                        }/>
                }
            </>
            }
            </View>
            {props?.val?
              <View style={{flex:1,bottom:responsiveHeight(6)}} >
                <Soundplayer navigation={props.navigation} setoffpalying = {(state,id)=>setoff(state,id)} />
              </View>
                :
            null} 
        </LinearGradient>
        
      // {/* </View>  */}
    )
}
const mapStateToProps = state => {
  const {val} = state.validatePlayer;
  return {
    val
  };
};
export default connect(mapStateToProps, {
  togglePlayer
})(downloads);