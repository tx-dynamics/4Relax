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
    const [selected,setSelected ] =  useState(false)
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
        var meditation = [];
        var filePath = [];
        var ImagePath = [];
        RNFetchBlob.fs.isDir(dir).then((isDir)=>{
          if(isDir){
            // alert('called if getfiles')
            RNFS.readDir(dir).then(files => {
              // return console.log(files[0].isFile)
              files.map((item)=>{
                // console.log(item)  
                if(item.name.includes("_img")){
                  ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                }else{
                  filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true})
                }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
              })
              filePath.map((item)=>{
                ImagePath.map((img)=>{
                  if(item.trackName === img.name){
                    meditation.push({"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,exists:true})
                  }
                })
              })
              // meditation = [{...filePath,...ImagePath}]
              console.log("????????????????????????????????????????")
              if(state.isConnected){
                console.log(meditation)
                // alert("called internal medi")
                setInternal(meditation)
                getfavorites(meditation)
      
              }else{
                console.log(meditation)
                setmeditations(meditation)
                setRefreshing(false);
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
       
      }

    async function getfavorites(fav) {
        const params ={
            userId:props?.userData?._id
        }
        try {
          const res = await props.get_allFAVORITES(params);
          var posts = res?.data

          posts.map((item)=>{
            return {
                ...item,
                isplaying: false,
              };
          })
          if (posts) {
            setTimeout(() => {
                checkData( posts ,fav)
            }, 1000);
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
        if(fav.length > 0){
          let trueData = [];
          let fasleData = [];
          posts.map(item=>{
            fav.filter(child=>{
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
          // alert("called else")
          setmeditations(posts);
          setRefreshing(false);
        }
        
  
      }


    async function  favourities(item){
        if(connection){
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
            Snackbar.show({
              text: 'No Internet Connection! ',
              backgroundColor: 'tomato',
              textColor: 'white',
            });
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
        
          return console.log(single);
            try {
                await AsyncStorage.setItem("single_item",JSON.stringify(single))

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
        requestToPermissions()
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
         var res =  meditations.map((post)=>{
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
          CheckConnectivity()
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
        setTimeout(() => {
          CheckConnectivity()
        }, 1500);
     
  
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
                null
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
                                        source={{uri :  connection? item.coverPic : 'file://' + item.coverPic}}
                                        borderRadius={4}
                                        style={{width:'100%',height:178}}
                                    >
                                        <View style={{flexDirection:'row',flex:0.3}}>
                                            <View style={{flex:0.29}}>
                                                <TouchableOpacity onPress={()=>favourities(item)} style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}>
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
    get_allFAVORITES,set_fav
  })(feed);
  