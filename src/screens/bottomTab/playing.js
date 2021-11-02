import React,{useState,useEffect,useRef} from 'react'
import {View,Text,TouchableOpacity,Slider,Image} from 'react-native'
import styles from './styles'
import {logo,cover,play,pause} from '../../assets'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Sound from 'react-native-sound';

// const sliderEditing = false;
const img_pause = require('../../assets/images/pause.png');
const img_play = require('../../assets/images/play.png');

export default function playing({props,onPres,single}) {
    const [playState,setplayState ] =  useState('paused')
    const [playSeconds,setplaySeconds ] =  useState(0)
    const [duration,setduration ] =  useState(0)
    const [sound,setSound ] =  useState()
    const [sliderEditing,setsliderEditing ] =  useState(false)
    var timeout ;
    
    useEffect(() => {
            // alert('called')
            // console.log(sound)

            play();
            setTimeout(() => {
                timeout = setInterval(() => {
                    // console.log(sound)
                    if(sound && sound.isLoaded() && playState == 'playing' && !sliderEditing){
                        alert("fokfofkorkfor")
                        sound.getCurrentTime((seconds, isPlaying) => {
                            alert(seconds)
                            setplaySeconds(seconds)
                            // this.setState({playSeconds:seconds});
                        })
                    }   
                }, 100);    
            }, 1000);
            
            
    }, [uncheck])

    const uncheck =()=>{
        if(sound){
            sound.release();
            sound = null;
        }
        if(timeout){
            clearInterval(timeout);
        }
    }

    const onSliderEditStart = () => {
        setsliderEditing(true)
    }
    const onSliderEditEnd = () => {
        // sliderEditing = false;
        setsliderEditing(false)

    }
    const onSliderEditing = value => {
        // console.log("value"+value)
        if(sound){
            sound.setCurrentTime(value);
            setplaySeconds(value)
            // this.setState({playSeconds:value});
        }
    }
     async function play  () {
        // alert("bad")
        var sound = new Sound({uri : single.trackFile}, (error) => {
        // alert("bad2")
            
            if (error) {
                console.log('failed to load the sound', error);
                Alert.alert('Notice', 'audio file error. (Error code : 1)');
                setplayState('paused')
            }else{
                setplayState('playing')
                setduration(sound.getDuration())
                // console.log()
                // setTimeout(() => {
                //     getCurrent(sound)
                // }, 100);
                // this.setState({playState:'playing', duration:this.});
                sound.play(playComplete);
            }
        });
        setSound(sound)
        // getCurrent()
        
        
    }

    const getCurrent = () => {
        
    }

    const  playComplete = (success) => {
        if(sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            setplaySeconds(0)
            setplayState('paused')
            // this.setState({playState:'paused', playSeconds:0});
            sound.setCurrentTime(0);
        }
    }

    function pause () {
        if(sound){
            sound.pause();
        }
        setplayState('paused')
        // this.setState({playState:'paused'});
    }

    function getAudioTimeString(seconds){
        // const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        // return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
        return ((m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    const currentTimeString = getAudioTimeString(playSeconds);
    const durationString = getAudioTimeString(duration);


    return (
        <View style={{width:'100%',height:87,borderRadius:15,backgroundColor:'#012229',bottom:7,alignSelf: 'flex-end'}}>
            <TouchableOpacity onPress={onPres} >
                <Text style={[styles.price,{fontSize:14,fontWeight:'400',color:'white',textAlign:'left',marginTop:10,marginLeft:15}]} >{single.trackName? single.trackName : single.trackType}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row',marginTop:8}}>
                <View style={{flex:2}}>
                    <View style={{flexDirection:'row',marginLeft:15}}>
                        <Slider
                            onTouchStart={onSliderEditStart}
                            // onTouchMove={() => console.log('onTouchMove')}
                            onTouchEnd={onSliderEditEnd}
                            // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                            // onTouchCancel={() => console.log('onTouchCancel')}
                            onValueChange={(value)=>onSliderEditing(value)}
                            value={playSeconds} maximumValue={duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
                            style={{ flex:1,alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:responsiveHeight(0.4),marginLeft:responsiveWidth(4)}}>
                        <View style={{flex:0.94}}>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{currentTimeString}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:14,fontWeight:'400',fontFamily:'Lato',color:'white'}} >{durationString}</Text>
                        </View>
                    </View>
                </View>
                {playState == 'playing' &&
                <TouchableOpacity onPress={()=>pause()} style={{flex:0.25,justifyContent:'center',marginBottom:responsiveHeight(8)}}>
                    <Image 
                        source={img_pause}
                        style={{width:32,height:32}}
                    />
                </TouchableOpacity>}
                {playState == 'paused' &&
                <TouchableOpacity onPress={()=>play()} style={{flex:0.25,justifyContent:'center',marginBottom:responsiveHeight(8)}}>
                    <Image 
                        source={img_play}
                        style={{width:32,height:32}}
                    />
                </TouchableOpacity>}                
            </View>

        </View>
    )
}
