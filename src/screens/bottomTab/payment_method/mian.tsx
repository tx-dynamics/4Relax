import { StripeProvider } from '@stripe/stripe-react-native';
import React, {useEffect, useState, useRef} from 'react';
import { CardField, useStripe } from '@stripe/stripe-react-native';
function main() {

  const [pk,setpk] = useState('pk_test_51Jmk4VFyQf9hqfHvM8aXN8Yop4s4RGsbrnCmij5q8kbQZ1A4Q5cH2FaM16zfmjHgNnXgp7BuDFtvkwbtpZZYagBq00ol5OoN5r')

  return (
    <StripeProvider
      publishableKey={pk}
      // merchantIdentifier="merchant.identifier"
    >
      <PaymentScreen />
    </StripeProvider>
  );
}

// PaymentScreen.ts


const PaymentScreen = () => {
  const { confirmPayment } = useStripe();

  return (
    <CardField
      postalCodeEnabled={true}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#a9a9a9',
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
  );
}

export default main