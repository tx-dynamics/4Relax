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
const data =[
    {
        id:0,
        name:'Meditate',
        selected:false
    },
    {
        id:1,
        name:'sleep',
        selected:true
    },
    {
        id:2,
        name:'Calm',
        selected:false
    },
    {
        id:3,
        name:'Calm Sound',
        selected:false
    },
]


    const story = (props) => {

    const [selected,setSelected ] =  useState(false);
    const [isplaying,setisplaying ] =  useState(false);
    const isFocused = useIsFocused();
    const [item,setitem ] =  useState();
    const [meditations,setmeditations ] =  useState([]);
    const [internal,setInternal ] =  useState()
    const [refreshing, setRefreshing] = useState(false);
    const [category,setcategory ] =  useState([])
    const [connection,setConnect ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [cateEmp,setcateEmp ] =  useState(false)

    useEffect(() => {
        CheckConnectivity()
        get_category()
        setcateEmp(false)
        setisplaying (false)

    }, [isFocused])
    
    async function get_category(){
      try {
        const res = await props.get_categories();
        var posts = res?.data
        
        setcategory(posts)
        


      } catch (err) {
        setRefreshing(false);

        console.log(err);
      }
    }

    function CheckConnectivity  ()  {
      setisplaying(false)
      setRefreshing(true);
      // For Android devices
      NetInfo.fetch().then((state) => {
        setConnect(state.isConnected)
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected,state.isInternetReachable);
        //if (Platform.OS === "android") {
          if (state.isConnected) {
            getFiles(state)
          } else {
            getFiles(state)
            Snackbar.show({
              text: 'You are not Connected to Internet, Continuing Offline!',
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
          }
        
      });
    };

    function getFiles(state){
      let dir = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
      var meditation = [];
      var filePath = [];
      var ImagePath = [];
      RNFetchBlob.fs.isDir(dir).then((isDir)=>{
        if(isDir){
          
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
              let cate = ''
              getStories(cate,meditation)
    
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
          // Snackbar.show({
          //   text: 'No local data found',
          //   backgroundColor: '#018CAB',
          //   textColor: 'tomato',
          // });
          let cate = '';
          let meditation = []
          getStories(cate,meditation)
        }
      })
     
      

    

    }

    async function getStories(cate = '',stories) {
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
                  if(item.trackCategory === cate){
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
        if(connection){
        const params = {
            trackId: item._id,
            trackType: "stories",
            trackName: item.trackName,
            trackFile:item.trackFile,
            coverPic:item.coverPic,
            userId:props?.userData?._id
          };
            // console.log(params)
          try {
            const res = await props.set_fav(params);
            // console.log('group_data', res);
            if (res?.data) {
                console.log(res?.data)
                let cat = '';
                let story = internal;
                getStories(cat,story)
                Snackbar.show({
                    text: res?.data,
                    backgroundColor: '#018CAB',
                    textColor: 'white',
                  });
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
                getStories(item.name,story)
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
              await AsyncStorage.setItem("single_item",JSON.stringify({...single,type:'stories'}))

          } catch (e) {
           alert("calling itself"+e)
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
      const tracktype = '/storage/emulated/0/Download/FourRelax/stories'

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
                  path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
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
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                  path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
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
              let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                    path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
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
                let SongDir =RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name
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
                    path : RNFetchBlob.fs.dirs.DownloadDir+'/FourRelax/stories'+ '/' + name+"_img",
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
        meditations.map((post)=>{
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
      }, 3000);
      
      
      
          // await AsyncStorage.setItem("")

    };

    async function deletefile(item,traname){
      setisplaying(false)
      let name = item.trackName;
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
            Snackbar.show({
              text: name+' Deleted',
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
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
                      null
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
                                              <TouchableOpacity onPress={()=> favourities(item)}  style={[styles.iconBackground,{left:16,top:12,marginLeft:responsiveWidth(0)}]}>
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
                                      {/* {item.unloc?
                                      <> */}
                                          {!(props?.userData?.subscriptionDetail?.subscriptionId === item.subscriptionType)?
                                              <TouchableOpacity onPress={()=> {
                                                  props.navigation.navigate('Packages'),
                                                  setislock(!islock)}}  style={[styles.iconBackground,{width:34,height:34,top:5}]}>
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
                                            :
                                              <TouchableOpacity onPress={()=> {
                                                startDownload(item,index)
                                                // setislock(!islock)
                                                }} style={{justifyContent:'center',top:5,marginLeft:responsiveWidth(2)}}  >
                                                <Image
                                                    source={download}
                                                    style={[styles.icon,{width:34,height:34,}]}
                                                />
                                              </TouchableOpacity>
                                          }</>
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