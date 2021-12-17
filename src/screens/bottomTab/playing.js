// import React,{useState,useEffect,useRef} from 'react'
// import {View,Text,TouchableOpacity,Slider,Image} from 'react-native'
// import styles from './styles'
// import {logo,cover,play,pause} from '../../assets'
// import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
// var Sound = require('react-native-sound');

// // const sliderEditing = false;
// const img_pause = require('../../assets/images/pause.png');
// const img_play = require('../../assets/images/play.png');

// export default function playing({props,onPres,single}) {
//     const [playState,setplayState ] =  useState('paused')
//     const [playSeconds,setplaySeconds ] =  useState(0)
//     const [duration,setduration ] =  useState(0)
//     const sound = single.trackFile;
//     const [sliderEditing,setsliderEditing ] =  useState(false)
//     const [timeout,setTimeout ] =  useState()
    
//     useEffect(() => {
//             // alert('called')
//             // console.log(sound)

//             play();
//                 setInterval(() => {
//                     // console.log(sound)
//                     if(sound &&  playState == 'playing' && !sliderEditing){
//                         alert("fokfofkorkfor")
//                         sound.getCurrentTime((seconds, isPlaying) => {
//                             alert(seconds)
//                             setplaySeconds(seconds)
//                             // this.setState({playSeconds:seconds});
//                         })
//                     }   
//                 }, 1000);    
//             // setTimeout(timeout)
//             return () =>{
//                 if(sound){
//                     sound.release();
//                     sound = null;
//                 }
//                 if(timeout){
//                     clearInterval(timeout);
//                 }
//             }
            
//     }, [])

//     // const uncheck =()=>{
//     //     if(sound){
//     //         sound.release();
//     //         sound = null;
//     //     }
//     //     if(timeout){
//     //         clearInterval(timeout);
//     //     }
//     // }

//     const onSliderEditStart = () => {
//         setsliderEditing(true)
//     }
//     const onSliderEditEnd = () => {
//         // sliderEditing = false;
//         setsliderEditing(false)

//     }
//     const onSliderEditing = value => {
//         console.log("value"+value)
//         if(sound){
//             sound.setCurrentTime(value);
//             setplaySeconds(value)
//             // this.setState({playSeconds:value});
//         }
//     }
//      async function play  () {
//         // alert("bad")
        
//         var music = new Sound({uri : sound}, (error) => {
//         // alert("bad2")
            
//             if (error) {
//                 console.log('failed to load the sound', error);
//                 Alert.alert('Notice', 'audio file error. (Error code : 1)');
//                 setplayState('paused')
//             }else{
//                 setplayState('playing')
//                 setduration(music.getDuration())
//                 // console.log()
//                 // setTimeout(() => {
//                 //     getCurrent(sound)
//                 // }, 100);
//                 // this.setState({playState:'playing', duration:this.});
//                 music.play(playComplete);
//             }
//         });
//         // setSound(sound)
//         // getCurrent()
        
//     }

//     const getCurrent = () => {
        
//     }

//     const  playComplete = (success) => {
//         if(sound){
//             if (success) {
//                 console.log('successfully finished playing');
//             } else {
//                 console.log('playback failed due to audio decoding errors');
//                 Alert.alert('Notice', 'audio file error. (Error code : 2)');
//             }
//             setplaySeconds(0)
//             setplayState('paused')
//             // this.setState({playState:'paused', playSeconds:0});
//             sound.setCurrentTime(0);
//         }
//     }

//     function pause () {
//         if(sound){
//             sound.pause();
//         }
//         setplayState('paused')
//         // this.setState({playState:'paused'});
//     }

//     function getAudioTimeString(seconds){
//         // const h = parseInt(seconds/(60*60));
//         const m = parseInt(seconds%(60*60)/60);
//         const s = parseInt(seconds%60);

//         // return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
//         return ((m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
//     }

//     const currentTimeString = getAudioTimeString(playSeconds);
//     const durationString = getAudioTimeString(duration);


//     return (
//         <View style={{width:'100%',height:87,borderRadius:15,backgroundColor:'#012229',bottom:7,alignSelf: 'flex-end'}}>
//             <TouchableOpacity onPress={onPres} >
//                 <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:10,marginLeft:15}]} >{single.trackName? single.trackName : single.trackType}</Text>
//             </TouchableOpacity>
//             <View style={{flexDirection:'row',marginTop:8}}>
//                 <View style={{flex:2}}>
//                     <View style={{flexDirection:'row',marginLeft:15}}>
//                         <Slider
//                             onTouchStart={onSliderEditStart}
//                             // onTouchMove={() => console.log('onTouchMove')}
//                             onTouchEnd={onSliderEditEnd}
//                             // onTouchEndCapture={() => console.log('onTouchEndCapture')}
//                             // onTouchCancel={() => console.log('onTouchCancel')}
//                             onValueChange={onSliderEditing}
//                             value={playSeconds} maximumValue={duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
//                             style={{ flex:1,alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
//                     </View>
//                     <View style={{flexDirection:'row',marginTop:responsiveHeight(0.4),marginLeft:responsiveWidth(4)}}>
//                         <View style={{flex:0.94}}>
//                             <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{currentTimeString}</Text>
//                         </View>
//                         <View>
//                             <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{durationString}</Text>
//                         </View>
//                     </View>
//                 </View>
//                 {playState == 'playing' &&
//                 <TouchableOpacity onPress={()=>pause()} style={{flex:0.25,justifyContent:'center',marginBottom:responsiveHeight(8)}}>
//                     <Image 
//                         source={img_pause}
//                         style={{width:32,height:32}}
//                     />
//                 </TouchableOpacity>}
//                 {playState == 'paused' &&
//                 <TouchableOpacity onPress={()=>play()} style={{flex:0.25,justifyContent:'center',marginBottom:responsiveHeight(8)}}>
//                     <Image 
//                         source={img_play}
//                         style={{width:32,height:32}}
//                     />
//                 </TouchableOpacity>}                
//             </View>

//         </View>
//     )
// }



import React,{useState,useEffect,useRef} from 'react'
import {View,Text,Alert,TouchableOpacity,ActivityIndicator,Image} from 'react-native'
import Slider from '@react-native-community/slider';
import styles from './styles'
import {logo,cover,play,pause} from '../../assets'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// const sliderEditing = false;

const fav = require('../../assets/images/fav.png');
const sound_test = require('../../assets/images/gta.mp3');
const img_pause = require('../../assets/images/pause.png');
const img_play = require('../../assets/images/play.png');
const img_playjumpleft = require('../../assets/images/backward.png');
const img_playjumpright = require('../../assets/images/forward.png');
const sliderEditing = false;
// const navigation = useNavigation();

export default class PlayerScreen extends React.Component{

    // static navigationOptions = props => ({
    //     title:props.navigation.state.params.title,
    // })

    constructor(props){
        super(props);
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0,
            item:{},
            isLoading:true
        }
        this.sliderEditing = false;
    }

    componentDidMount(){
        // console.log(this.props.navigation)
        
        // this.props.navigation.addListener("focus", () => {
        //     alert('called2')

        //     this.getData();
        // })
        this.getData();

        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    // console.log(seconds)
                    this.setState({playSeconds:seconds});
                })
            }
        }, 1300);

    }

    getData = async()=>{
        var data = await AsyncStorage.getItem("single_item")
        
        // uid = (JSON.parse(userId))
        // console.log("palying =================",JSON.parse(data))
        this.setState({item:JSON.parse(data)})
        // return console.log(JSON.parse(data))
        setTimeout(() => {
            this.play();
        }, 2000);

    }

    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            // this.sound.stop();  
            this.sound = null;
            console.log('caled 1')
        }else{
            this.sound = null;
            // this.sound.stop();  
            console.log('caled 3')
        }
        if(this.timeout){
            console.log('caled 2')
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
        // return console.log(this.state.item.trackFile)
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
    
            this.sound = new Sound({uri : this.state.item.trackFile}, (error) => {
                // alert("bad")
                
                if (error) {
                    // console.log('failed to load the sound', error);
                    // Alert.alert('Notice', 'audio file error. (Error code : 1)');
                    this.setState({playState:'paused'});
                }else{
                    // alert("else called")
                    this.setState({playState:'playing', duration:this.sound.getDuration(),isLoading:false});
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
                // console.log('playback failed due to audio decoding errors');
                // Alert.alert('Notice', 'audio file error. (Error code : 2)');
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
        // console.log(this.props)
        const {item} =  this.state
        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);
    return (
        <View style={{width:'100%',height:87,borderRadius:15,backgroundColor:'#012229',bottom:responsiveHeight(1.5),alignSelf: 'flex-end'}}>
            {this.state.isLoading?
                <ActivityIndicator size={'large'} color={'white'} style={{marginTop:responsiveHeight(3.5),alignSelf:'center',justifyContent:'center'}} />
            :
            <>
            <TouchableOpacity onPress={()=> 
                {this.pause(),
                this.props.navigation.navigate('AudiofileStack',{screen:'Track',params:{single:item}})
                // this.props.navigation.navigate('AudioPlayer',{single:item})
                }}>
                <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:responsiveHeight(1),marginLeft:responsiveWidth(5)}]} >{item.trackName? item.trackName : item.trackType}</Text>
                {/* <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:10,marginLeft:15}]} >{single.trackName? single.trackName : single.trackType}</Text> */}
            </TouchableOpacity>
            <View style={{flexDirection:'row',marginTop:responsiveHeight(1)}}>
                <View style={{flex:2.5}}>
                    <View style={{flexDirection:'row',marginLeft:responsiveWidth(2.5)}}>
                        <Slider
                            onTouchStart={this.onSliderEditStart}
                            // onTouchMove={() => console.log('onTouchMove')}
                            onTouchEnd={this.onSliderEditEnd}
                            // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                            // onTouchCancel={() => console.log('onTouchCancel')}
                            onValueChange={this.onSliderEditing}
                            value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='#FFFFFF' minimumTrackTintColor='#7497FF'  thumbTintColor='white' 
                            style={{ flex:10,alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:responsiveHeight(0.4),marginLeft:responsiveWidth(5)}}>
                        <View style={{flex:0.95}}>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{currentTimeString}</Text>
                        </View>
                        <View style={{}} >
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{durationString}</Text>
                        </View>
                    </View>
                </View>
                {this.state.playState == 'playing' &&
                <TouchableOpacity onPress={()=>this.pause()} style={{flex:0.4,alignItems:'center',justifyContent:'center',marginBottom:responsiveHeight(10)}}>
                    <Image 
                        source={img_pause}
                        style={{width:32,height:32,marginRight:responsiveWidth(3.4)}}
                    />
                </TouchableOpacity>}
                {this.state.playState == 'paused' &&
                <TouchableOpacity onPress={()=>this.play()} style={{flex:0.4,alignItems:'center',justifyContent:'center',marginBottom:responsiveHeight(10)}}>
                    <Image 
                        source={img_play}
                        style={{width:32,height:32,marginRight:responsiveWidth(3.3)}}
                    />
                </TouchableOpacity>}                
            </View>

            </>
            }
            
        </View>
    )
}
}
