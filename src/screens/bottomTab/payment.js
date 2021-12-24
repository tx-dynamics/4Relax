import React, {useEffect, useState, useRef} from 'react';
import {Alert,Button,ActivityIndicator,TouchableOpacity,Image,Text,View} from 'react-native'
// import { CardField, useStripe ,StripeProvider} from '@stripe/stripe-react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input"; // 0.4.1
import LinearGradient from 'react-native-linear-gradient';
import {Header, FAB} from 'react-native-elements';
import {feed,pause,play,fav,del,left,music,explore} from '../../assets'
import styles from './styles'
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import {get_paymentResponse} from '../../redux/actions/auth';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';


const PaymentScreen = (props) => {
//   const { confirmPayment } = useStripe();

  const [isloading, setisloading] = useState(false);
  const [useLiteCreditCardInput, setuseLiteCreditCardInput] = useState(false);
  const [singleitem, setSingle] = useState({});
  const [formData, setForm] = useState({});

  useEffect(() => {
    let single = props?.route?.params?.payment
    setSingle(single)
   
  }, []);

 
  const Stripe = () =>  {

    // return console.log(formData);
    setisloading(true)
    var stripe_url = 'https://api.stripe.com/v1/tokens?card[number]=' + formData.values.number + '&card[exp_month]=' + formData.values.expiry.split('/')[0] + '&card[exp_year]=' + formData.values.expiry.split('/')[1] + '&card[cvc]=' + formData.values.cvc + '&card[name]=' + formData.values.name;
    // alert(stripe_url)
    Payment(stripe_url)

  }


  async function Payment  (url)  {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + 'pk_test_51Jmk4VFyQf9hqfHvM8aXN8Yop4s4RGsbrnCmij5q8kbQZ1A4Q5cH2FaM16zfmjHgNnXgp7BuDFtvkwbtpZZYagBq00ol5OoN5r'
      }
    });
    let responseJson = await response.json();
    //alert(JSON.stringify(responseJson))
    if (responseJson.error) {
      alert('Invalid Credential')

    } else {

      charge_request(responseJson.id)
        // console.log(responseJson);
    //   alert('Payment Successfull')
    }
  }

  async function charge_request  (id) {
    console.log("#############################")
    const params = {
        stripeToken:id,
        userId:props?.userData?._id,
        subscriptionId:singleitem._id,
        subscriptionAmount:singleitem.subscriptionAmount,
        subscriptionName:singleitem.subscriptionName
    }
    // return console.log(params);
    try {
        const res = await props.get_paymentResponse(params);
        var subs = res?.data
        var msg = res?.data?.msg
        console.log("***************PAYMENT***************",res?.data);
        if(res?.data){
          if(msg == 'Payment Successful'){
            Snackbar.show({
              text: msg,
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
            props.navigation.goBack()
          }else{
            Snackbar.show({
              text: msg,
              backgroundColor: '#018CAB',
              textColor: 'white',
            });
          }
            
        }
        
          setisloading(false)
        // setSubs(subs)
      } catch (err) {
        setisloading(false)
        console.log(err);
      }

  }

  function _onChange (formData)  {
    // console.log(formData);
    setForm(formData)
    // this.setState({ formData: formData, number: formData.status.number })
  }
  
  function _onFocus  (field) { console.log("focusing", field);}
  return (
    <LinearGradient
      start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
      style={{flex:1}}  
    >
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
                <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >PAYMENT</Text>
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
                <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#ffff',marginRight:responsiveWidth(12)}} >PAYMENT</Text>
              </View>
          </View>
        <ScrollView showsVerticalScrollIndicator={false} >
        
        <View>
            <Text style={[styles.price,{color:'#ffff',fontSize:20,marginTop:responsiveHeight(8)}]} >Selected Package : {singleitem.subscriptionName}</Text>
            <Text style={[styles.price,{color:'#ffff',fontSize:20,marginTop:responsiveHeight(2)}]} >Package Price : {singleitem.subscriptionAmount}</Text>
        </View>
        <View style={{ flex:0.9,marginTop:responsiveHeight(5) }}>
                
                    <CreditCardInput
                    autoFocus

                    requiresName
                    requiresCVC
                    // requiresPostalCode

                    cardScale={1.0}
                    labelStyle={{color:'white',fontSize:12}}
                    inputStyle={{color:'#CCCCCC',fontSize:16}}
                    validColor={'#CCCCCC'}
                    selectionColor={'#CCCCCC'}
                    invalidColor={"tomato"}
                    placeholderColor={"darkgray"}

                    onFocus={_onFocus}
                    onChange={_onChange} />
                
            </View>

        
        {formData.valid?
            <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
                    style={[styles.setting_btn,{marginTop:responsiveHeight(18),elevation:5,width:'80%',alignSelf:'center',marginBottom:responsiveHeight(5)}]}
                    >
                {isloading?
                    <ActivityIndicator style={{alignSelf:'center',justifyContent:'center'}} size={'large'} color={'white'}  />
                :
                    <TouchableOpacity onPress={()=>Stripe()} >
                        <Text style={[styles.title,{fontSize:18}]} >Confirm Payment</Text>
                    </TouchableOpacity>
                }
                
            </LinearGradient>
        :
        <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
              style={[styles.setting_btn,{marginTop:responsiveHeight(18),elevation:5,width:'80%',alignSelf:'center',marginBottom:responsiveHeight(5)}]}
              >
              <TouchableOpacity onPress={()=>alert("Complete required card details")} >
                  <Text style={[styles.title,{fontSize:18}]} >Confirm Payment</Text>
              </TouchableOpacity>
          
      </LinearGradient>
      }
        
      </ScrollView>
    {/* <Button title="Confirm payment" onPress={handleConfirmation} /> */}
    </LinearGradient>
  );
}
const mapStateToProps = state => {
    const {userData} = state.auth;
    return {
        userData,
      };
  };
export default connect(mapStateToProps, {get_paymentResponse})(PaymentScreen);