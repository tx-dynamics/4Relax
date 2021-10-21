import React from "react";
import { StyleSheet, View } from "react-native";

import Tabbar from "../components/Tabar";

interface AppProps {}

 class App extends React.Component<AppProps> {
  render() {
    return (
      <View style={styles.container}>
        <Tabbar {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // opacity:0,
    backgroundColor: "#00303A",
    justifyContent: "flex-end",
  },
});

export default App;