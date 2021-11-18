import React, {useEffect, useState, useRef} from 'react';
import {Alert,Button,TouchableOpacity,Image,Text,View} from 'react-native'
import { CardField, useStripe ,StripeProvider} from '@stripe/stripe-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Header, FAB} from 'react-native-elements';
import {feed,pause,play,fav,del,left,music,explore} from '../../../assets'
import styles from '../styles'
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
function main(props) {

  // console.log(props?.route?.params);

  const [pk,setpk] = useState('pk_test_51JsUi4KzpmJoYoYYN5Ll6CcgvL6iS5adZhfcvvAzZwGeXUcLqFKFqWrxY583tmxPqxkfsyVAzht4ZKiztJFdHbC200q4eEwJWt')

  return (
    <StripeProvider
      publishableKey={pk}
      // merchantIdentifier="merchant.identifier"
    >
      <PaymentScreen pros={props} item={props?.route?.params} onpress={props.navigation}/>
    </StripeProvider>
  );
}

// PaymentScreen.ts


const PaymentScreen = (props,item) => {
  const { confirmPayment } = useStripe();

  const [key, setKey] = useState('');
  const [singleitem, setSingle] = useState({});

  useEffect(() => {
    // let single = props.item.payment
    // setSingle(single)
    // setTimeout(() => {
    //   console.log(singleitem);
    // }, 5000);
    // console.log(props.item)
    // console.log(single)
    // fetch('https://localhost:3000/create-payment-intent', {
    //   method: 'POST',
    //   // headers: { "Content-Type": "application/json" },
    // })
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log('intent', res);
    //     setKey((res as {clientSecret: string}).clientSecret);
    //   })
    //   .catch(e => Alert.alert("error located at: "+e.message));
  }, []);

  const handleConfirmation = async () => {
    alert('called')
    if (key) {
      const {paymentIntent, error} = await confirmPayment(key, {
        type: 'Card',
        billingDetails: {
          email: 'asimmehar124@gmail.com',
        },
      });

      if (!error) {
        Alert.alert('Received payment', `Billed for ${paymentIntent?.amount}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  // const Stripe = () =>  {

  //   // console.log(this.state.formData.values.number);

  //   var stripe_url = 'https://api.stripe.com/v1/tokens?card[number]=' + this.state.formData.values.number + '&card[exp_month]=' + this.state.formData.values.expiry.split('/')[0] + '&card[exp_year]=' + this.state.formData.values.expiry.split('/')[1] + '&card[cvc]=' + this.state.formData.values.cvc + '&card[name]=' + this.state.formData.values.name;
  //   alert(stripe_url)
  //   // this.Payment(stripe_url)

  // }


  // Payment = async (url) => {
  //   let response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       "Authorization": "Bearer " + 'pk_live_51J95CZL7uaqGpfwOVr03VlEr9qjQil43l6rdxhC2rqg1mXUwVy0mkKrcv4oML5ZrlqMpETK2zEVEp09fY4KyGhfm00KGQjPnzN'
  //     }
  //   });
  //   let responseJson = await response.json();
  //   //alert(JSON.stringify(responseJson))
  //   if (responseJson.error) {
  //     alert('Invalid Credential')

  //   } else {

  //     this.charge_request(responseJson.id)

  //     // alert('Payment Successfull')
  //   }
  // }

  // charge_request = async (id) => {

  //   const formData = new FormData()
  //   var user_id = await AsyncStorage.getItem('id')

  //   formData.append('token', id);
  //   formData.append("subscriber_id", user_id);
  //   formData.append("trainer_id", JSON.stringify(this.state.trainer_id));
  //   formData.append("amount", Math.round(this.state.trainer_price * 100));
  //   formData.append("description", "this is trainer subscription");
  //   // formData.append("transaction_id","2143c232c3");
  //   // console.log(formData);



  //   try {


  //     // var x = await fetch(`${BasePath}subscribe`, { method: 'POST', body: formData } )
  //     //   x.json().then(result=> {
  //     //       if (!result.error) {
  //     //           Toast.show(
  //     //               'success' +
  //     //                result.success_msg
  //     //             )
  //     //           // this.setState({success: true})
  //     //           this.setState({isLoading:false})

  //     //           // this.props.history.push('/user/profile/'+this.state.user.id)
  //     //       }
  //     //   })


  //     fetch(`${BasePath}subscribe`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((responseJson) => {

  //         console.log(responseJson);

  //         Toast.show('Payment Done', { position: Toast.position.TOP })
  //         this.setState({ isLoading: false })

  //         this.setState({ paymentDoneSwitch: true })
  //         setTimeout(() => {
  //           this.props.navigation.replace('AlphaProfile', { trainer: this.state.trainer_id })
  //         }, 800);
  //       })
  //       .catch((error) => {
  //         this.setState({ isLoading: false })
  //         console.log('e2 ' + error)
  //         Toast.show("Message1:" + error)

  //       });
  //   } catch (e) {
  //     this.setState({ isLoading: false })
  //     console.log('e1 ' + e)
  //     Toast.show("Message2:" + e)

  //   }

  // }


  return (
    <LinearGradient
      start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
      style={{flex:1}}  
    >
      <Header
          backgroundColor="transparent"
          containerStyle={{
          alignSelf: 'center',
          // height: ,
          borderBottomWidth: 0,
          // borderBottomColor: '#E1E3E6',
          }}
          leftComponent={
              <TouchableOpacity style={{width:30,height:30,justifyContent:'center',alignItems:'center'}} onPress={()=> props.onpress.goBack()} >
                  <Image
                      source={left}  
                      style={{width:7,height:14,tintColor:'white'}}
                  />
              </TouchableOpacity>
              
          }
          centerComponent={
              <Text style={{fontFamily:'Lato',fontWeight:'700',fontSize:22,color:'#fff'}} >PAYMENT</Text>
          }
      />
      <View>
        <Text style={[styles.price,{color:'#ffff',fontSize:20,marginTop:responsiveHeight(8)}]} >Selected Package : {props.item.payment.subscriptionName}</Text>
        <Text style={[styles.price,{color:'#ffff',fontSize:20,marginTop:responsiveHeight(2)}]} >Package Price : {props.item.payment.subscriptionAmount}</Text>
      </View>
      <View style={{width:'80%',alignSelf:'center',borderRadius:8}} >
      <CardField
      postalCodeEnabled={false}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#018CAB',
        textColor: 'black',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('cardDetails', cardDetails);
      }}
      onFocus={(focusedField) => {
        console.log('focusField', focusedField);
      }}
    />
      </View>
      <View style={{height:'30%'}} />
      <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']} 
              style={[styles.setting_btn,{marginTop:responsiveHeight(4),elevation:5,width:'80%',alignSelf:'center'}]}
              >
          <TouchableOpacity>
              <Text style={[styles.title,{fontSize:18}]} >Confirm Payment</Text>
          </TouchableOpacity>
      </LinearGradient>
    {/* <Button title="Confirm payment" onPress={handleConfirmation} /> */}
    </LinearGradient>
  );
}

export default main