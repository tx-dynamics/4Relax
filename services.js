import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  await TrackPlayer.addEventListener("remote-jump-forward",  async (event) => {
      let position = await TrackPlayer.getPosition();
      let newPosition = position + event.interval;
      await TrackPlayer.seekTo(newPosition);
  });

  await TrackPlayer.addEventListener("remote-jump-backward",  async (event) => {
      let position = await TrackPlayer.getPosition();
      let newPosition = position > 9 ? position - event.interval : 0;
      await TrackPlayer.seekTo(newPosition);
  });

  TrackPlayer.addEventListener('remote-seek', ({position}) => {
      TrackPlayer.seekTo(position);
    //   console.log('remote seek:', position);
  });
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
};