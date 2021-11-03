import * as React from "react";
import {
  View, StyleSheet,Image, TouchableWithoutFeedback, Animated, Dimensions,
} from "react-native";
// import { music,feed,fav,setting,explore} from "../assets";
import LinearGradient from 'react-native-linear-gradient';


const { width } = Dimensions.get("window");

interface Tab {
  name?: string ;
  style?:{}
}

interface StaticTabbarProps {
  tabs: Tab[];
  value: Animated.Value;
}

class StaticTabbar extends React.PureComponent<StaticTabbarProps> {
  values: Animated.Value[] = [];

  

  constructor(props: StaticTabbarProps) {
    super(props);
    const { tabs } = this.props;
    this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0));
  }

  onPress = (index: number) => {
    // if(index === 0){
    //   alert(index);
    // }
    const { value, tabs } = this.props;
    console.log(index )
    const tabWidth = width / tabs.length;
    Animated.sequence([
      Animated.parallel(
        this.values.map(v => Animated.timing(v, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        })),
      ),
      Animated.parallel([
        Animated.spring(value, {
          toValue: tabWidth * index,
          useNativeDriver: true,
        }),
        Animated.spring(this.values[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }

  

  render() {
    const { onPress } = this;
    const { tabs, value } = this.props;
    return (
      
      <View style={styles.container}>
        {
          tabs.map((tab, key) => {
            const tabWidth = width / tabs.length;
            const cursor = tabWidth * key;
            const opacity = value.interpolate({
              inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
              outputRange: [1, 0, 1],
              extrapolate: "clamp",
            });
            const translateY = this.values[key].interpolate({
              inputRange: [0, 1],
              outputRange: [64, 0],
              extrapolate: "clamp",
            });
            const opacity1 = this.values[key].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolate: "clamp",
            });
            return (

              <React.Fragment {...{ key }}>
                <TouchableWithoutFeedback onPress={() => {
                  onPress(key)
                }}>
                  <Animated.View style={[styles.tab, { opacity }]}>
                    {/* <Icon name={tab.name} color="black" size={25} /> */}
                    <Image source={tab.name} style={tab.style}  />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View
                  style={{
                    position: "absolute",
                    top: -22,
                    left: tabWidth * key,
                    width: tabWidth,
                    height: 64,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: opacity1,
                    transform: [{ translateY }],
                  }}
                >
                <LinearGradient
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00647A',  '#072931']}
                    style={styles.activeIcon}
                    >
                {/* <View style={styles.activeIcon}> */}
                    <Image source={tab.name} style={tab.style}  />
                    {/* <Icon name={tab.name} color="black" size={25} /> */}
                  {/* </View> */}
                </LinearGradient>
                  
                </Animated.View>
              </React.Fragment>
            );
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 64,
  },
  activeIcon: {
    // backgroundColor: "white",
    width: 51.3,
    height: 51.3,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default StaticTabbar