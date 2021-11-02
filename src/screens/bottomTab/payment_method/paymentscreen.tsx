import React, {useEffect, useState, useRef} from 'react';
import { CardField, useStripe } from '@stripe/stripe-react-native';
 function PaymentScreen() {
    const { confirmPayment } = useStripe();
  
    return (
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: 'red',
          textColor: '#000000',
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
      // <CardForm
      //   onFormComplete={(cardDetails) => {
      //   console.log('card details', cardDetails);
      //     setCard(cardDetails);
      //   }}
      //   style={{height: 200}}
      // />
    );
  }

  export default PaymentScreen;