import React,{Component} from "react";
import { StyleSheet, View,Dimensions } from "react-native";
import Tabbar from "../components/Tabar";
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
  
} from 'react-native-responsive-dimensions';
// interface AppProps {}

 class App extends Component {
  constructor(props) {
    super(props);
  }

   

  render() {
    // const navigation = this.props.navigation 
    // this.props.descriptors.map((item)=>{
    //   console.log(item.navigation)

    // })
    // console.log(navigation)

    return (
      <View style={styles.container}>
        <Tabbar {...this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // position:'absolute',
    // alignSelf:'flex-end',
    // zIndex:1,
    marginTop:'auto',
    // flex: 1,
    // top:responsiveHeight(89),
    // opacity:0,
    backgroundColor: "#00303A",
    // alignItems:'flex-end',
    alignSelf:'flex-end',
    justifyContent: "flex-end",
  },
});

export default App;