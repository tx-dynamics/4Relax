import React,{useState} from 'react'
import {View,Text,ImageBackground,Image,Slider,FlatList, Dimensions, ActivityIndicator} from 'react-native'
import {logo,shuffle,bg,left,pause,play,del} from '../../assets'
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// const img_speaker = require('./resources/ui_speaker.png');

const fav = require('../../assets/images/fav.png');
const sound_test = require('../../assets/images/gta.mp3');
const img_pause = require('../../assets/images/pause.png');
const img_play = require('../../assets/images/play.png');
const img_playjumpleft = require('../../assets/images/backward.png');
const img_playjumpright = require('../../assets/images/forward.png');
const sliderEditing = false;

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
            connection:false,
            isLoading:true,
            don:false,
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
        console.log(this.props.navigation);
        // this.props.navigation.addListener(
        //     'didBlur',
        //     () => this.sound.pause()
        //   )
        var id = this.props.route.params.single._id
        var fav = this.props.route.params.single
        var type = this.props.route.params.single.type
        var tracktype = this.props.route.params.single.trackType
        // this.setState({single:id})
        // console.log("***********************************777777777")
        // console.log(id)

        
        this.getSingle(id,fav,type,tracktype);
        
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

  
    CheckConnectivity  ()  {
        // For Android devices
        NetInfo.fetch().then((state) => {
          this.setState({connection:state.isConnected})
          console.log("Connection type", state.type);
          console.log("Is connected?", state.isConnected,state.isInternetReachable);
          
        });
      };

    getSingle = async (id,fav,type,tracktype) => {
        let userId = await AsyncStorage.getItem('userId');
        console.log("***************************",userId)
        const params = {
            userId : userId
        }
        if(id){
        if(type === 'meditation'){
            // alert('meditation')
        try {
            // alert('called meditation')
            const res = await axios.post(`${BASE_URL}api/relax/meditation/getSingle/${id}`,JSON.stringify(params), {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(res?.data)
            if(res?.data){
                this.setState({single:res?.data})
                setTimeout(() => {
                    this.play()
                }, 500);
            }
          } catch (err) {
            console.log("error found : "+err);
          }
        }else if(type === 'Sounds'){
            try {
                    // alert('Sounds')
                const res = await axios.post(`${BASE_URL}api/relax/sounds/getSingle/${id}`,JSON.stringify(params), {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                });
                // console.log(res?.data)
                if(res?.data){
                    this.setState({single:res?.data})
                    setTimeout(() => {
                        this.play()
                    }, 500);
                }
                } catch (err) {
                console.log("error found : "+err);
                }
        }else if(type === 'stories'){
            try {
                    // alert('stories')
                const res = await axios.post(`${BASE_URL}api/relax/stories/getSingle/${id}`,JSON.stringify(params), {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                });
                // console.log(res?.data)
                if(res?.data){
                    this.setState({single:res?.data})
                    setTimeout(() => {
                        this.play()
                    }, 500);
                }
                } catch (err) {
                console.log("error found : "+err);
                }
        }else if(tracktype){
            try {
                    // alert('fav : '+tracktype)
                    if(fav){
                        this.setState({single:fav})
                        setTimeout(() => {
                            this.play()
                        }, 500);
                    }
                // const res = await axios.get(`${BASE_URL}api/relax/sounds/getSingle/${id}`, {
                //     headers: {
                //     Accept: 'application/json',
                //     'Content-Type': 'application/json',
                //     },
                // });
                // // console.log(res?.data)
                // if(res?.data){
                //     this.setState({single:res?.data})
                //     setTimeout(() => {
                //         this.play()
                //     }, 500);
                // }
                } catch (err) {
                console.log("error found : "+err);
                }
        }else{
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
                        this.play()
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

    play = async () => {
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
                    this.setState({playState:'playing',isLoading:false, duration:this.sound.getDuration()});
                    this.sound.play(this.playComplete);
                }
            });    
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

    getAudioTimeString(seconds){
        // const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        // return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
        return ((m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render(){
        const {single} = this.state
        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <View style={{flex:1,backgroundColor:'#00303A'}}>
                
                 <ImageBackground
                    source={{uri: 
                        this.state.don?
                            'file://' + single.coverPic
                        :
                        this.state.connection?
                            single.coverPic 
                            :
                            'file://' + single.coverPic}}
                    
                    style={[styles.imgBackground,{height:'100%',alignItems:'center'}]}
                >
                <View style={{
                        height: '100%',
                        width:'100%',
                        backgroundColor: '#00000080',
                    }} >
                        <View style={{width:'90%',alignSelf:'center',alignItems:'center',flexDirection:'row',marginTop:responsiveHeight(4)}} >
                            <View style={{flex:0.98}}>
                                <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                    <Image
                                        source={left}
                                        style={{width:7,height:14}}
                                    />
                                </TouchableOpacity>
                                
                            </View>
                            {/* <TouchableOpacity style={{width:32,height:32,borderRadius:50,backgroundColor:'rgba(31, 26, 21, 0.56)',alignItems:'center'}} >
                                <Image
                                    source={del}
                                    style={{width:16,height:16,alignSelf:'center',marginTop:responsiveHeight(1)}}
                                />
                            </TouchableOpacity> */}
                        </View>
                        <View style={{alignItems:'center',marginTop:responsiveHeight(6)}} >
                            {/* <Text style={{fontSize:18,fontWeight:'500',fontFamily:'Lato'}} >{single.trackName? single.trackName : single.trackType}</Text> */}
                            {/* <Text style={{fontSize:16,fontWeight:'400',fontFamily:'Lato'}} >{single.trackType}</Text> */}
                        </View>
                        
                        {this.state.isLoading?
                            <View style={{alignItems:'center',justifyContent:'center',flex:1}} >
                                <ActivityIndicator style={{alignSelf:'center'}} size={'large'} color={'white'} />
                            </View>
                        :
                            <>
                                <View style={{marginTop:responsiveHeight(60)}}>
                                <View style={{flexDirection:'row',flex:1,marginVertical:15, }}>
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
                                    <Image
                                        source={fav}
                                        style={{width:20,height:18,alignSelf:'center',  tintColor:single.liked === 'no'? 'white' :'#FF4040'}}
                                    />
                                    {/* // :
                                    // <Image
                                    //     source={fav}
                                    //     style={{width:20,height:18,alignSelf:'center',  tintColor:'#FF5959'}}
                                    // />
                                    } */}
                                    
                                </View>
                                <View style={{flex:0.8,flexDirection:'row', justifyContent:'space-around',alignItems:'center'}} >
                                    <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{}}>
                                        <Image source={img_playjumpleft} style={{width:16, height:20}}/>
                                        <View style={{position:'absolute',top:responsiveHeight(1),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                            <Text style={{textAlign:'center' ,color:'white', fontSize:6}}>20</Text>
                                        </View>
                                    </TouchableOpacity> 
                                    {this.state.playState == 'playing' && 
                                    <TouchableOpacity onPress={this.pause} style={{marginHorizontal:20}}>
                                        <Image source={img_pause} style={{width:42.88, height:42.88}}/>
                                    </TouchableOpacity>}
                                    {this.state.playState == 'paused' && 
                                    <TouchableOpacity onPress={this.play} style={{marginHorizontal:20}}>
                                        <Image source={img_play} style={{width:42.88, height:42.88}}/>
                                    </TouchableOpacity>}
                                    <TouchableOpacity onPress={this.jumpNext15Seconds} style={{}}>
                                        <Image source={img_playjumpright} style={{width:16, height:20}}/>
                                        <View style={{position:'absolute',top:responsiveHeight(1),bottom:0,left:0,right:0,alignSelf:'center'}} >
                                            <Text style={{textAlign:'center' , color:'white', fontSize:6}}>20</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:0.15}} >
                                    <Image
                                        source={shuffle}
                                        style={{width:19,height:17,alignSelf:'center'}}
                                    />
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
