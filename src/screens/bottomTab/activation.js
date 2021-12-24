import React,{useState,Fragment,useRef} from 'react'
import {View,Text,ImageBackground,ScrollView,Linking,TouchableOpacity,Image,TextInput,FlatList,Switch} from 'react-native'
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

import styles from './styles'
import stylesS from '../scanner/styles'


export default function downloads(props) {

    const scanner = useRef()
    const [selected,setSelected ] =  useState(false)
    const [isEnabled, setIsEnabled] = useState(false);
    const [scan, setscan] = useState(false);
    const [ScanResult, setScanResult] = useState(false);
    const [result, setresult] = useState(null);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    function onSuccess (e)  {
        const check = e.data.substring(0, 4);
        console.log('scanned data' + check);
        setresult(e)
        setscan(false)
        setScanResult(true)
        // this.setState({
        //     result: e,
        //     scan: false,
        //     ScanResult: true
        // })
        if (check === 'http') {
            Linking.openURL(e.data).catch(err => console.error('An error occured', err));
        } else {
            setresult(e)
            setscan(false)
            setScanResult(true)
        }
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


    return (
        <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
            style={{flex:1}}>
            {/* <Header
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
                    <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >ACTIVATION</Text>
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
                  <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff',marginRight:responsiveWidth(12)}} >ACTIVATION</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{alignItems:'center',width:'100%',alignSelf:'center',marginTop:responsiveHeight(5)}}>
                    
                    <Text style={[styles.title,{fontSize:14,fontWeight:'500'}]} >Enter the code below or scan QR code</Text>
                    <View style={{width:'100%',flexDirection:'row',alignSelf:'center',justifyContent:'center',marginTop:responsiveHeight(3)}}>
                        <View style={styles.code_cont} >
                            <TextInput
                                style={styles.code}
                            />
                        </View>
                        <Text style={{alignSelf:'center'}} >  -  </Text>
                        <View style={styles.code_cont} >
                            <TextInput
                                style={styles.code}
                            />
                        </View>
                        <Text style={{alignSelf:'center'}} >  -  </Text>
                        <View style={styles.code_cont} >
                            <TextInput
                                style={styles.code}
                            />
                        </View>

                    </View>
                    <View style={{width:'90%'}} >
                        <LinearGradient
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                                style={[styles.setting_btn,{marginTop:responsiveHeight(4)}]}
                                >
                            <TouchableOpacity onPress={()=>alert('eef')}>
                                <Text style={[styles.title,{fontSize:18}]} >Activate</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                        {scan?
                            <View style={{height:400,padding:40,marginTop:responsiveHeight(5),marginBottom:responsiveHeight(5)}} >
                                <QRCodeScanner
                                    reactivate={true}
                                    showMarker={true}
                                    // ref={(node) => { scanner = node}}
                                    onRead={onSuccess}
                                    topContent={
                                        <Text style={stylesS.centerText}>
                                        Please move your camera {"\n"} over the QR Code
                                        </Text>
                                    }
                                    />
                            </View>
                        :
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
                            <TouchableOpacity onPress={()=>{
                                // alert("called")
                                setscan(!scan)
                                }} >
                                <Text style={[styles.title,{fontSize:18}]} >Press to Scan</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    <View style={{height:200}} />
                </View>
            </ScrollView>
        </LinearGradient>
    )
}
