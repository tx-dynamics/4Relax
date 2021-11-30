
import React,{useState,useEffect} from 'react'
import {View,Text,ActivityIndicator,ImageBackground,Image,TextInput,FlatList,Switch} from 'react-native'
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
import {send_contact} from '../../redux/actions/contact_sent';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';

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

    

     function chectData (){
        if(email === '' || subject === '' || msg === ''){
            Snackbar.show({
                text: 'All fields are required',
                backgroundColor: 'tomato',
                textColor: 'white',
              });
        }else if(!emailValidate(email)){
            Snackbar.show({
                text: 'Email is required',
                backgroundColor: 'tomato',
                textColor: 'white',
              });
        }else if(!ValidateName(subject)){
            Snackbar.show({
                text: 'Subject should be in alphabets only',
                backgroundColor: 'tomato',
                textColor: 'white',
              });
        }else if(!ValidateName(msg)){
            Snackbar.show({
                text: 'Message should be in alphabets only',
                backgroundColor: 'tomato',
                textColor: 'white',
              });
        }else {
            sendData()
        }
    }

    async function sendData (){
        setisLoading(true)
        try {
            const params ={
                "email":email,
                "subject":subject,
                "bodyText":msg
            }
            const res = await props.send_contact(params);
            var data = res?.data
            if(data.msg){
                console.log(data);
                Snackbar.show({
                    text: data.msg,
                    backgroundColor: '#018CAB',
                    textColor: 'white',
                  });
                  props.navigation.goBack()
            }else{
                // console.log(data);
                Snackbar.show({
                    text: data.err,
                    backgroundColor: 'tomato',
                    textColor: 'white',
                  });
            }
            
            } catch (err) {
            setRefreshing(false);
    
            console.log(err);
            }
        setisLoading(false)

    }

    function emailValidate (email){
        const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const emailValid = re.test(email);
    //   alert(emailValid)
      return emailValid
    }

    const ValidateName = (text) => {
        var regExp = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
        var name = text.match(regExp);
        if (name) {
    
          return true;
        }
        return false;
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
                placeholder={"Email*"}
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
                    borderRadius: 8,
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
                placeholder={"Subject*"}
                style={{
                width: "80%",
                alignSelf: "center",
                paddingHorizontal: 15,
                backgroundColor: "#FFFFFF",
                marginTop: 20,
                fontSize: 14,
                color:'black',
                borderWidth: 2,
                borderRadius: 8,
                borderColor: "#CCCDCC",
                paddingVertical: 7,
                borderWidth: 1.5,
                }}
                onChangeText={(text) => setSubject(text)}
                value={subject}
                // keyboardType="phone-pad"
                placeholderTextColor={"#3E4143"}
                underlineColorAndroid="transparent"
            />
            <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder={"Message*"}
            style={{
                width: "80%",
                alignSelf: "center",
                height: 200,
                color:'black',
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 15,
                marginTop: 20,
                fontSize: 16,
                fontWeight: "400",
                paddingVertical: responsiveHeight(2),
                borderWidth: 1.5,
                borderColor: "#CCCDCC",
                borderRadius: 8,
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
            {isLoading?
                <ActivityIndicator animating color={'white'} size={25} />
            :
                <TouchableOpacity onPress={()=> chectData()} >
                    <Text style={[styles.title,{fontSize:18}]} >Send</Text>
                </TouchableOpacity>
            }
            
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
  export default connect(mapStateToProps, {
    send_contact
  })(contact);