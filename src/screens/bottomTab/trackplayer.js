// import React,{Component} from 'react'
// import TrackPlayer from "react-native-track-player";
// export default class Screen1 extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   componentWillMount() {
//     TrackPlayer.setupPlayer().then(async () => {
//       // Adds a track to the queue
//       await TrackPlayer.add({
//         id: "123",
//         url:"https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3",
//         title: "Track Title",
//         artist: "Track Artist",
//         artwork:"https://socialecologies.files.wordpress.com/2015/10/a_monk.jpg"
//       });
//       TrackPlayer.updateOptions({
//         capabilities: [
//           TrackPlayer.CAPABILITY_PLAY,
//           TrackPlayer.CAPABILITY_PAUSE,
//           TrackPlayer.CAPABILITY_STOP
//         ],
//         compactCapabilities: [
//           TrackPlayer.CAPABILITY_PLAY,
//           TrackPlayer.CAPABILITY_PAUSE,
//           TrackPlayer.CAPABILITY_STOP
//         ]
//       });
//       // Starts playing it
//       TrackPlayer.play();
//     });
//   }
//   render() {
//     return <View style={Styler.container} />;
//   }
// }

import React from 'react'

export default function trackplayer() {
    return (
        <div>
            
        </div>
    )
}
