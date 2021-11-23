
import React,{useState,useEffect} from 'react'
import {View,Text,ImageBackground,Image,TextInput,FlatList,Switch} from 'react-native'
import {select,option,green,lokc,check,cross,icon} from '../../assets'
import {
    responsiveHeight,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveWidth,
    } from 'react-native-responsive-dimensions';
    import LinearGradient from 'react-native-linear-gradient';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles'
import {get_subscription} from '../../redux/actions/getSubscription';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

function contact(props) {

    const [subscription,setSubs ] =  useState([])
    const [msg,setMsg ] =  useState('')
    const [subject,setSubject ] =  useState('')
    const [email,setEmail ] =  useState('')
    const [isLoading,setisLoading ] =  useState(false)
    const isFocused = useIsFocused();
    
    useEffect(() => {
        let email = props?.userData?.email
        setEmail(email)
        // console.log("cureent subs id=======>",packge_id);
        // setSubId(packge_id)
        // get_all()
    }, [isFocused])

    async function get_all (){
        try {
            const res = await props.get_subscription();
            var subs = res?.data
            
            setSubs(subs)
            } catch (err) {
            setRefreshing(false);
    
            console.log(err);
            }
    }

    return (
        <LinearGradient
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
        style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={()=> props.navigation.goBack()}>
                <Image
                    source={cross}
                    style={{width:16,height:16,margin:20}}
                />
            </TouchableOpacity>
            <Image
                    source={icon}
                    style={{width:165,height:54,alignSelf:'center'}}
                />
            <View style={{marginTop:responsiveHeight(4),width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:18,fontWeight:'700',color:'#ffffff',fontFamily:'Lato',alignSelf:'center'}} >Contact with us</Text>

                <Text style={{ marginTop:25 }}></Text>
                <TextInput
                placeholder={"Email"}
                style={{
                    width: "80%",
                    color:'black',
                    alignSelf: "center",
                    paddingHorizontal: 15,
                    backgroundColor: "#FFFFFF",
                    marginTop: 20,
                    fontSize: 14,
                    // fontWeight: "400",
                    borderWidth: 2,
                    borderRadius: 26,
                    borderColor: "#CCCDCC",
                    paddingVertical: 7,
                    borderWidth: 1.5,
                }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                // placeholderTextColor={"#3E4143"}
                underlineColorAndroid="transparent"
                />
                <TextInput
                placeholder={"Subject"}
                style={{
                width: "80%",
                alignSelf: "center",
                paddingHorizontal: 15,
                backgroundColor: "#FFFFFF",
                marginTop: 20,
                fontSize: 14,
                // fontWeight: "400",
                borderWidth: 2,
                borderRadius: 26,
                borderColor: "#CCCDCC",
                paddingVertical: 7,
                borderWidth: 1.5,
                }}
                onChangeText={(text) => setSubject(text)}
                value={subject}
                keyboardType="phone-pad"
                placeholderTextColor={"#3E4143"}
                underlineColorAndroid="transparent"
            />
            <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder={"Message"}
            style={{
                width: "80%",
                alignSelf: "center",
                height: 200,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 15,
                marginTop: 20,
                fontSize: 16,
                fontWeight: "400",
                paddingVertical: responsiveHeight(2),
                borderWidth: 1.5,
                borderColor: "#CCCDCC",
                borderRadius: 26,
            }}
            textAlignVertical="top"
            onChangeText={(text) => setMsg(text)}
            value={msg}
            placeholderTextColor={"#3E4143"}
            underlineColorAndroid="transparent"
            />
        
        <Text style={{ marginTop: 10 }}></Text>
       

        <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                style={[styles.setting_btn,{marginTop:responsiveHeight(4),marginBottom:responsiveHeight(3)}]}
                >
            <TouchableOpacity onPress={()=> props.navigation.navigate('Activation')} >
                <Text style={[styles.title,{fontSize:18}]} >Send</Text>
            </TouchableOpacity>
        </LinearGradient>

                
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
    export default connect(mapStateToProps, {get_subscription})(contact);