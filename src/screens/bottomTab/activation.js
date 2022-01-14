import React,{useState,Fragment,useRef} from 'react'
import {View,Text,ImageBackground,ScrollView,Linking,TouchableOpacity,Image,TextInput,ActivityIndicator,Switch} from 'react-native'
import {feed,pause,play,fav,QRcode,left,music,explore} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
  } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {Header, FAB} from 'react-native-elements';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {activation_code} from '../../redux/actions/auth';
import {connect} from 'react-redux';
import Snackbar from 'react-native-snackbar';

import styles from './styles'
import stylesS from '../scanner/styles'


function activation(props) {

    const scanner = useRef()
    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [scan, setscan] = useState(false);
    const [loader, setloader] = useState(false);
    const [loader2, setloader2] = useState(false);
    const [ScanResult, setScanResult] = useState(false);
    const [result, setresult] = useState(null);
    const [code1, setcode1] = useState('');
    const [code2, setcode2] = useState('');
    const [code3, setcode3] = useState('');
    const code2ref = useRef(null)
    const code3ref = useRef(null)
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    function onSuccess (e)  {
        setscan(!scan)
        setloader2(true)
        // console.log(e.);
        const check = e.data;
        console.log('scanned data ' + check);
        if(check.includes('http')){
            Snackbar.show({
                text: 'Activation code is not correct',
                backgroundColor: 'tomato',
                textColor: 'white',
              });
            setloader2(false)
        }else{
            setresult(e.data)
            activation_api(check)
    }
        // setScanResult(true)
        // this.setState({
        //     result: e,
        //     scan: false,
        //     ScanResult: true
        // })
        // if (check.substring(0,4) === 'http') {
        //     Linking.openURL(e.data).catch(err => console.error('An error occured', err));
        // } else {
        //     // alert('called')
        //     setscan(!scan)
        //     setresult(e)
        //     setScanResult(true)
        // }
    }

    function activeQR  ()  {
        setscan(true)
        // this.setState({ scan: true })
    }
    function scanAgain () {
        setscan(true)
        setScanResult(false)
        // this.setState({ scan: true, ScanResult: false })
    }

    async function activation_api  (val) {
        console.log("#############################")
        let code = val.replace(/-/ig,'')
        let id = props?.userData?._id
        const params = {
            value:code,
        }
        // return console.log("inside activation k",params,id);
        try {
            const res = await props.activation_code(params,id);
            // var subs = res?.data
            // var msg = res?.data?.msg
            // console.log("***************PAYMENT***************",res?.data);
            if(res?.data){
            //   if(msg == 'Payment Successful'){
                Snackbar.show({
                  text: "Activation code Recognized Successfully",
                  backgroundColor: '#018CAB',
                  textColor: 'white',
                });
                props.navigation.goBack()
              }else{
                Snackbar.show({
                  text: 'Activation code is not correct',
                  backgroundColor: 'tomato',
                  textColor: 'white',
                });
            //   }
                
            }
            
            setloader2(false)
            // setSubs(subs)
          } catch (err) {
            setloader2(false)
            console.log(err);
          }
    
      }
    
    async function code_api(){
        setloader(true)
        const code = code1+code2+code3
        // alert(code)
        let id = props?.userData?._id
        const params = {
            value:code,
        }
        // return console.log("inside activation k",params,id);
        try {
            const res = await props.activation_code(params,id);
            // var subs = res?.data
            // var msg = res?.data?.msg
            // console.log("***************PAYMENT***************",res);
            if(res?.data){
            //   if(msg == 'Payment Successful'){
                Snackbar.show({
                  text: "Activation code Recognized Successfully",
                  backgroundColor: '#018CAB',
                  textColor: 'white',
                });
                props.navigation.goBack()
              }else{
                Snackbar.show({
                  text: 'Activation code is not correct',
                  backgroundColor: 'tomato',
                  textColor: 'white',
                });
            //   }
                
            }
            
              setloader(false)
            // setSubs(subs)
          } catch (err) {
            setloader(false)
            console.log(err);
          }
    }

    return (
        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
            style={{flex:1}}>
           
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
                  <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff',marginRight:responsiveWidth(12)}} >ACTIVATION</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{alignItems:'center',width:'100%',alignSelf:'center',marginTop:responsiveHeight(5)}}>
                    
                    <Text style={[styles.title,{fontSize:14,fontWeight:'500'}]} >Enter the code below or scan QR code</Text>
                    <View style={{width:'100%',flexDirection:'row',alignSelf:'center',justifyContent:'center',marginTop:responsiveHeight(3)}}>
                        <View style={styles.code_cont} >
                            <TextInput
                                value={code1}
                                onChangeText={value => {
                                    setcode1(value)
                                    if(value.length === 4){
                                        code2ref.current.focus()
                                    }
                                }}
                                maxLength={4}
                                style={styles.code}

                            />
                        </View>
                        <Text style={{alignSelf:'center'}} >  -  </Text>
                        <View style={styles.code_cont} >
                            <TextInput
                                ref={code2ref}
                                value={code2}
                                onChangeText={value => {
                                    setcode2(value)
                                    if(value.length === 4){
                                        code3ref.current.focus()
                                    }
                                }}
                                maxLength={4}
                                style={styles.code}
                            />
                        </View>
                        <Text style={{alignSelf:'center'}} >  -  </Text>
                        <View style={styles.code_cont} >
                            <TextInput
                                ref={code3ref}
                                value={code3}
                                onChangeText={value => setcode3(value)}
                                maxLength={4}
                                style={styles.code}
                            />
                        </View>

                    </View>
                    <View style={{width:'90%'}} >
                        <LinearGradient
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                                style={[styles.setting_btn,{marginTop:responsiveHeight(4)}]}
                                >
                            {loader?
                                <ActivityIndicator style={{alignSelf:'center',justifyContent:'center'}} size={'large'} color={'white'}  />
                            :
                                <TouchableOpacity onPress={()=>code_api()}>
                                    <Text style={[styles.title,{fontSize:18}]} >Activate</Text>
                                </TouchableOpacity>
                            }
                        </LinearGradient>
                    </View>
                        {scan === true &&
                            <View style={{height:400,padding:40,marginTop:responsiveHeight(5),marginBottom:responsiveHeight(5)}} >
                                <QRCodeScanner
                                    reactivate={true}
                                    showMarker={true}
                                    ref={(node) => { scanner.current = node}}
                                    onRead={onSuccess}
                                    topContent={
                                        <Text style={stylesS.centerText}>
                                        Please move your camera {"\n"} over the QR Code
                                        </Text>
                                    }
                                    />
                            </View>
                            }
                        {scan === false &&
                        <Image
                        source={QRcode}
                        style={{width:166.67,height:166.67,marginTop:responsiveHeight(10),}}
                    />
                }

                    <View style={{marginTop:responsiveHeight(10),backgroundColor:'grey'}}>
                           
                        {ScanResult &&
                            <Fragment>
                                <Text style={stylesS.textTitle1}>Result</Text>
                                <View style={ScanResult ? stylesS.scanCardView : stylesS.cardView}>
                                    <Text>Type : {result.type}</Text>
                                    <Text>Result : {result.data}</Text>
                                    <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                                    <TouchableOpacity onPress={scanAgain()} style={stylesS.buttonScan}>
                                        <View style={stylesS.buttonWrapper}>
                                            <Text style={{...stylesS.buttonTextStyle, color: '#2196f3'}}>Click to scan again</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                        }
                        
                    </View>
                    <View style={{width:'90%'}} >
                        <LinearGradient
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                                style={[styles.setting_btn,{marginTop:responsiveHeight(8)}]}
                                >
                            {loader2?
                                <ActivityIndicator style={{alignSelf:'center',justifyContent:'center'}} size={'large'} color={'white'}  />
                            :
                            <TouchableOpacity onPress={()=>{
                                // alert("called")
                                setscan(!scan)
                                }} >
                                <Text style={[styles.title,{fontSize:18}]} >Press to Scan</Text>
                            </TouchableOpacity>
                            }
                        </LinearGradient>
                    </View>
                    <View style={{height:200}} />
                </View>
            </ScrollView>
        </LinearGradient>
    )
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    return {
        userData,
      };
  };
export default connect(mapStateToProps, {activation_code})(activation);