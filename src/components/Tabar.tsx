import React, {Component} from "react";
import {
  SafeAreaView, StyleSheet, Dimensions, View, Animated,
} from "react-native";
import * as shape from "d3-shape";
import  Svg,{ Path } from "react-native-svg";
import { music,feed,fav,setting,explore} from "../assets";
import LinearGradient from 'react-native-linear-gradient';

import StaticTabbar from "./staticbar";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const { width } = Dimensions.get("window");
const height = 64;
// const { Path } = Svg;
const tabs = [
  {
    name: feed,
    style:{width:33,height:28}
  },
  {
    name: explore ,
    style:{width:23,height:25}

  },
  {
    name: music ,
    style:{width:15.32,height:32.52}

  },
  {
    name: fav,
    style:{width:22.83,height:20.31}

  },
  {
    name: setting,
    style:{width:22,height:22}

  },
];
const tabWidth = width / tabs.length;
const backgroundColor = "#018CAB";

const getPath = (): string => {
  const left = shape.line().x(d => d.x).y(d => d.y)([
    { x: 0, y: 0 },
    { x: width, y: 0 },
  ]);
  const tab = shape.line().x(d => d.x).y(d => d.y).curve(shape.curveBasis)([
    { x: width - 5, y: 0 },
    { x: width + 2, y: 0 },
    { x: width + 5, y: 10 },
    { x: width + 15, y: height-15 },
    { x: width + tabWidth - 15, y: height - 15 },
    { x: width + tabWidth - 5, y: 10 },
    { x: width + tabWidth - 2, y: 0 },
    { x: width + tabWidth + 10, y: 0 },
  ]);
  const right = shape.line().x(d => d.x).y(d => d.y)([
    { x: width + tabWidth, y: 0 },
    { x: width * 2, y: 0 },
    { x: width * 2, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 },
  ]);
  return `${left} ${tab} ${right}`;
};
const d = getPath();
interface TabbarProps {}

// eslint-disable-next-line react/prefer-stateless-function
export default class Tabbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  value = new Animated.Value(0);

  render() {
    const navigation = this.props
    
    const { value } = this;
    const translateX = value.interpolate({
      inputRange: [0, width],
      outputRange: [-width, 0],
    });
    return (
      <>
      
        <View {...{ height, width }}>
        <AnimatedSvg width={width * 2} {...{ height }} style={{ transform: [{ translateX }] }}>
        {/* <LinearGradient
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#018CAB',  '#000A0D']}
                // style={{height:Dimensions.get('window').height}}
                > */}
                <Path fill={backgroundColor} {...{ d }} />
        {/* </LinearGradient> */}
        </AnimatedSvg>
          
          <View style={StyleSheet.absoluteFill}>
            <StaticTabbar {...{ tabs, value,navigation }} />
          </View>
        </View>
        <SafeAreaView style={styles.container} />

      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor,
  },
});0