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
import Soundplayer from './playing'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import theme from '../../theme';


export default function downloads(props) {

    const isFocused = useIsFocused();
    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [isplaying,setisplaying ] =  useState(false)
    const [islock,setislock ] =  useState(false)
    const [cateEmp,setcateEmp ] =  useState(false)
    const [item,setitem ] =  useState()
    const [meditations,setmeditations ] =  useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [connection,setConnect ] =  useState(false)
    const [internal,setInternal ] =  useState()
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        getfile()
    }, [isFocused])

    function getfile (){
        setisplaying (false)
        setRefreshing(true)
        let dirs = RNFS.DownloadDirectoryPath + '/FourRelax/stories'
        let dirso = RNFS.DownloadDirectoryPath + '/FourRelax/sounds'
        let dirm = RNFS.DownloadDirectoryPath + '/FourRelax/meditation'

        var meditation = [];
        var sounds = [];
        var stories = [];
        var final = [];
        var filePath = [];
        var ImagePath = [];
        RNFetchBlob.fs.isDir(dirm).then((isDir)=>{
          if(isDir){
            
            RNFS.readDir(dirm).then(files => {
              // return console.log(files[0].isFile)
              files.map((item)=>{
                // console.log(item)  
                if(item.name.includes("_img")){
                  ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                }else{
                  filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true,"type":'meditation'})
                }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
              })
              filePath.map((item)=>{
                ImagePath.map((img)=>{
                  if(item.trackName === img.name){
                    meditation.push({'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                  }
                })
              })
              // meditation = [{...filePath,...ImagePath}]
              setmeditations(meditation)
              console.log("??????????????????meditation??????????????????????")
              console.log(meditation)
            
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

        RNFetchBlob.fs.isDir(dirso).then((isDir)=>{
            if(isDir){
              
              RNFS.readDir(dirso).then(files => {
                // return console.log(files[0].isFile)
                files.map((item)=>{
                  // console.log(item)  
                  if(item.name.includes("_img")){
                    ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                  }else{
                    filePath.push({"trackFile":item.path,"trackName":item.name,isdownloading:true,exists:true,"type":'sound'})
                  }
                  // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
                })
                filePath.map((item)=>{
                  ImagePath.map((img)=>{
                    if(item.trackName === img.name){
                        sounds.push({'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                    }
                  })
                })
                // meditation = [{...filePath,...ImagePath}]
                setmeditations(sounds)
                // console.log("??????????????????sounds??????????????????????")
                // console.log(sounds)
             
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


        RNFetchBlob.fs.isDir(dirs).then((isDir)=>{
        if(isDir){
            
            RNFS.readDir(dirs).then(files => {
            // return console.log(files[0].isFile)
            files.map((item)=>{
                // console.log(item)  
                if(item.name.includes("_img")){
                ImagePath.push({"name":item.name.split("_")[0],"coverPic":item.path})
                }else{
                filePath.push({"trackFile":item.path,"type":'story',"trackName":item.name,isdownloading:true,exists:true})
                }
                // meditation.push( {"trackFile":item.path,"trackName":item.name,isdownloading:true})
            })
            filePath.map((item)=>{
                ImagePath.map((img)=>{
                if(item.trackName === img.name){
                    stories.push({'type':item.type,"trackFile":item.trackFile,"trackName":item.trackName,isdownloading:item.isdownloading,"coverPic":img.coverPic, isplaying: false,liked:false,exists:true})
                }
                })
            })
            // meditation = [{...filePath,...ImagePath}]
            setmeditations(stories)

            // console.log("?????????????????????stories???????????????????")
            // console.log(stories)
            
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
            // });
            let meditation = []
            getfavorites(meditation)
        }
        })

        // final.push(meditation,sounds,stories)
        // console.log("+++++++++++++++++++++++++++++++++++++")
        // return console.log(final)
        // setmeditations(final)
        setTimeout(() => {
        return console.log(meditation)
            
        }, 5000);
        setRefreshing(false)

    }

    const setData = async (single,name) => {
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
        
        
            try {
                await AsyncStorage.setItem("single_item",JSON.stringify(single))

            } catch (e) {
             alert("calling itself"+e)
            }
        // alert('called set data')
                
                // var data = await AsyncStorage.getItem("single_item")
                // console.log(JSON.parse(data).trackName) 
    }

    async function deletefile(item,traname,type){
      setisplaying(false)
        if(type === 'meditation'){
            let name = item.trackName;
            let cover = name.concat("_img");
            // return console.log(cover)
            let dir = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + name; 
            let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/meditation/' + cover;
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
        }else if(type === 'sound'){
            let name = item.trackName;
            let cover = name.concat("_img");
            // return console.log(cover)
            let dir = RNFS.DownloadDirectoryPath + '/FourRelax/sounds/' + name; 
            let dirImg = RNFS.DownloadDirectoryPath + '/FourRelax/sounds/' + cover;
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
        }else{
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
        }
        
        setTimeout(() => {
          getfile()
        }, 1500);
     
  
      }

    return (
        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
            style={{flex:1}}>
            <Header
                backgroundColor="transparent"
                containerStyle={{
                alignSelf: 'center',
                // height: ,
                borderBottomWidth: 0,
                // borderBottomColor: '#E1E3E6',
                }}
                leftComponent={
                    <TouchableOpacity style={{width:30,height:30,justifyContent:'center',alignItems:'center'}} onPress={()=> props.navigation.goBack()} >
                        <Image
                            source={left}  
                            style={{width:7,height:14,tintColor:'white'}}
                        />
                    </TouchableOpacity>
                    
                }
                centerComponent={
                    <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >DOWNLOADS</Text>
                }
            />
            <View style={{alignItems:'center',width:'90%',height:'88%',alignSelf:'center',marginTop:responsiveHeight(1)}}>
            {refreshing?
                null
            :
            <>
                {meditations.length < 1?
                    <View style={{flex:1,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                        <Text style={styles.title} >No Downloads Found</Text>
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
                            <LinearGradient
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                                    style={styles.setting_btn}
                                    >
                                    <View   style={{flexDirection:'row',height:50,alignItems:'center'}}>
                                        {item.type === 'meditation'?
                                            <>
                                                <Image
                                                    source={feed}
                                                    style={{width:21,height:19,left:10}}
                                                />
                                                <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'55%',color:theme.colors.primary}} >Meditate</Text>
                                            </>
                                        :
                                            <>
                                            {item.type === 'sound'?
                                                <>
                                                    <Image
                                                        source={music}
                                                        style={{width:15,height:32,left:10}}
                                                    />
                                                    <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(7),width:'56.5%',color:theme.colors.primary}} >Sound</Text>
                                                </>
                                            :
                                            <>
                                                    <Image
                                                        source={explore}
                                                        style={{width:21,height:19,left:10}}
                                                    />
                                                    <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'55%',color:theme.colors.primary}} >Story</Text>
                                                </>
                                            }
                                            </>
                                        }
                                        {item.isplaying?
                                            <TouchableOpacity onPress={()=> setData(item,item.trackName)} >
                                                <Image
                                                    source={pause}
                                                    style={[styles.icon,{width:22.67,height:22.67}]}
                                                />
                                            </TouchableOpacity>
                                            :
                                            
                                            <TouchableOpacity onPress={()=> setData(item,item.trackName)}
                                                >
                                                <Image
                                                    source={play}
                                                    style={[styles.icon,{width:22,height:22}]}
                                                />
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity>
                                            <Image
                                                source={fav}
                                                style={{width:22,height:19,tintColor:'#FF4040',marginLeft:responsiveWidth(5.5),tintColor:item.liked ? 'white' :'#FF4040'}}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{deletefile(item,item.trackName,item.type)}}>
                                            <Image
                                                source={del}
                                                style={{width:17,height:18,marginLeft:responsiveWidth(5.5)}}
                                            />
                                        </TouchableOpacity>
                                    </View>

                            </LinearGradient>
                        }/>
                }
            </>
            }
            
            
            {isplaying?
                <Soundplayer navigation={props.navigation} />
                :
            null} 

            

            </View>
        </LinearGradient>
    )
}
