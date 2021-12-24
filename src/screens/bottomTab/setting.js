import React,{useState} from 'react'
import {View,Text,ImageBackground,Linking,Image,FlatList,Share,Switch} from 'react-native'
import {logo,settin,product,right,contact,notification,share,rate,info,policy,terms,logout} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
  import LinearGradient from 'react-native-linear-gradient';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import {logoOut,switch_noification} from '../../redux/actions/auth';
import {connect} from 'react-redux';
import theme from '../../theme';
import Snackbar from 'react-native-snackbar';
import Soundplayer from './trackbanner'
import {togglePlayer} from '../../redux/actions/validate_player';


function setting(props) {

    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(props?.userData?.allowNotification);
    
    
    const toggleSwitch = async () => {
        try{
            if(props.userData.allowNotification){
                setIsEnabled(false);
            }else{
                setIsEnabled(true);
            }

            let id = props.userData._id
            // console.log(props.userData)
            const res = await props.switch_noification(id)
            console.log(res.data.allowNotification);
            if(res.data.allowNotification){
                // alert('allowed')
                // Snackbar.show({
                //     text: 'allowed',
                //     backgroundColor: '#F14336',
                //     textColor: 'white',
                //   });  
            }else{
                // setIsEnabled(previousState => !previousState);
                // alert('not allowed')
                // Snackbar.show({
                //     text: 'not allowed',
                //     backgroundColor: '#F14336',
                //     textColor: 'white',
                //   });  
            }
        }catch(e){console.log(e)}
    }

    async function onlogout() {
        await props.togglePlayer(false)
        props.logoOut()
        props.navigation.push('Auth', {screen: 'Signin'})
      }

    async function onShare  () {
    try {
        const result = await Share.share({
        message:
            "Share your experience with your friends",
        });
        if (result.action === Share.sharedAction) {
        if (result.activityType) {
            // shared with activity type of result.activityType
        } else {
            // shared
        }
        } else if (result.action === Share.dismissedAction) {
        // dismissed
        }
    } catch (error) {
        alert(error.message);
    }
    };

    async  function openUrl ()  {
        const url = 'https://www.google.com/'
        await Linking.openURL(url);
        // console.log('clicked');
    }
    async function setdownload (){
        await props.togglePlayer(false)
        props.navigation.navigate('Downloads')
    }

    function setoff(state,id){
        // alert('called')
    //     const res = meditations.map((item)=>{
    //       // console.log(item._id === id)
    //       if(item){
    //           return {
    //               ...item,
    //               isplaying: false,
    //             };
    //       } else {
    //           return {
    //               ...item,
    //               // isplaying: false,
    //             };
    //       }
    //   })
    //   setmeditations(res)
      }

    return (
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
        style={{flex:1}}>
            <ImageBackground
                source={settin}
                style={styles.imgBackground}
            >
                <Text style={styles.title}>SETTINGS</Text>
                <View style={{height:'50%'}} />

                <Image
                    source={logo}
                    style={styles.img}
                />
               
            </ImageBackground>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{alignItems:'center',width:'90%',alignSelf:'center'}}>
                    <Text style={[styles.title,{fontSize:12,top:12}]} >Version 1.0.1</Text>
                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Packages')}  style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={product}
                                style={{width:16,height:16,left:10}}
                            />
                            <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%',color:theme.colors.primary}} >Subscription</Text>
                            <Image
                                source={right}
                                style={{width:5,height:10}}
                            />
                        </TouchableOpacity>

                    </LinearGradient>

                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                            <View style={{flexDirection:'row'}}>
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',width:'95%'}}>
                                    <Image
                                        source={notification}
                                        style={{width:16,height:16,left:10}}
                                    />
                                    <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'80%',color:theme.colors.primary}} >Notifications</Text>
                                </TouchableOpacity>
                                <View style={{width:'20%'}}>
                                    <Switch
                                        trackColor={{ false: "#A9A9A9", true: "#003d4a" }}
                                        thumbColor={isEnabled ? "#0184A1" : "#f4f3f4" }
                                        ios_backgroundColor="#0184A1"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                            </View>
                        </View>

                    </LinearGradient>

                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                        <TouchableOpacity onPress={()=> {
                            setdownload()
                            }} style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={product}
                                style={{width:16,height:16,left:10}}
                            />
                            <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%',color:theme.colors.primary}} >Downloads</Text>
                            <Image
                                source={right}
                                style={{width:5,height:10}}
                            />
                        </TouchableOpacity>

                    </LinearGradient>

                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                        <TouchableOpacity onPress={()=> props.navigation.navigate('Contact') } style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={contact}
                                style={{width:16,height:16,left:10}}
                            />
                            <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%',color:theme.colors.primary}} >Contact us</Text>
                            <Image
                                source={right}
                                style={{width:5,height:10}}
                            />
                        </TouchableOpacity>

                    </LinearGradient>

                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                        <TouchableOpacity onPress={()=> openUrl()} style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={policy}
                                style={{width:16,height:16,left:10}}
                            />
                            <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%',color:theme.colors.primary}} >Privacy Policy</Text>
                            <Image
                                source={right}
                                style={{width:5,height:10}}
                            />
                        </TouchableOpacity>

                    </LinearGradient>


                    <LinearGradient
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                        style={styles.setting_btn}
                        >
                        <TouchableOpacity onPress={()=> openUrl() } style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                source={terms}
                                style={{width:16,height:16,left:10}}
                            />
                            <Text style={{fontSize:14,fontFamily:'Lato',fontWeight:'500',left:responsiveWidth(5),width:'88%',color:theme.colors.primary}} >Terms of Use</Text>
                            <Image
                                source={right}
                                style={{width:5,height:10}}
                            />
                        </TouchableOpacity>

                    </LinearGradient>

                </View>

                <View style={{marginTop:responsiveWidth(8),marginBottom:responsiveHeight(4),flexDirection:'row',justifyContent:'center'}}>
                    <LinearGradient 
                        style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center'}}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                    >
                        <TouchableOpacity onPress={()=>{alert('Any info provided by client')}} style={{}}>
                            <Image 
                                source={info}
                                style={{width:13.92,height:21.6}}
                            />
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient 
                        style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:responsiveWidth(6)}}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                    >
                        <TouchableOpacity onPress={()=>onShare()} style={{}}>
                            <Image 
                                source={share}
                                style={{width:19.05,height:20.04}}
                            />
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient 
                        style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:responsiveWidth(6)}}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                    >
                        <TouchableOpacity onPress={()=>{alert('Will be handled after placing it on Google play store')}} style={{}}>
                            <Image 
                                source={rate}
                                style={{width:17.07,height:17.21    }}
                            />
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient 
                        style={{width:51.3,height:51.3,borderRadius:100,alignItems:'center',justifyContent:'center',marginLeft:responsiveWidth(6)}}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']} 
                    >
                        <TouchableOpacity  onPress={()=> {
                           onlogout()
                            // props.navigation.replace('Signin')
                        }}  style={{}}>
                            <Image
                                source={logout}
                                style={{width:30,height:30,tintColor:'#FFFFFF'}}
                            />
                        </TouchableOpacity>
                    </LinearGradient>

                </View>
            </ScrollView>
            <>
              {props?.val?
                  <Soundplayer navigation={props.navigation} setoffpalying = {(state,id)=>setoff(state,id)} />
                  :
              null}
            </>
        </LinearGradient>
    )
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    const {val} = state.validatePlayer;

    return {userData,val};
  };
  export default connect(mapStateToProps, {logoOut,switch_noification,togglePlayer})(setting);
