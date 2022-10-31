import { StyleSheet, SafeAreaView, Text, FlatList, Pressable, View, Image } from "react-native";
import { useSpotifyAuth, millisToMinutesAndSeconds } from "./utils";
import { Images, Themes } from "./assets/Themes";
import { ScrollView } from "react-native-web";

export default function App() {
  // Pass in true to useSpotifyAuth to use the album ID (in env.js) instead of top tracks
  const { token, tracks, getSpotifyAuth } = useSpotifyAuth();

  let contentDisplayed = null;
  
  if (token) {
    contentDisplayed = <SongList tracks={tracks} />
  } else {
    contentDisplayed = <ConnectButton getSpotifyAuth={getSpotifyAuth} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

const ConnectButton = ({ getSpotifyAuth }) => {
  return (
    <View>
      <Pressable onPress={getSpotifyAuth}>
        <View style={styles.buttonContainer}>
          <Image style={styles.spotifyIcon} source={Images.spotify} />
          <Text style={{color: 'white', fontFamily: "Helvetica", fontWeight: 'bold'}}>CONNECT WITH SPOTIFY</Text>
        </View>
      </Pressable>
    </View>
  );
}

const Header = () => {
  return (
    <View style={styles.header}>
      <Image style={styles.spotifyIconHeader} source={Images.spotify} />
      <Text style={{ color: 'white', fontSize: 22, fontFamily: "Helvetica", fontWeight: 'bold' }}>My Top Tracks</Text>
    </View>
  )
}

const SongList = ({tracks}) => {
  return (
    <View>
      <Header />
      <FlatList scroll={true} data={tracks} renderItem={RenderTrack} keyExtractor={(item) => item.id} />
    </View>
  )
}

const RenderTrack = ({ index, item }) => {  // renders one song
  const image_url = item.album.images[0].url
  const artist_name = item.album.artists[0].name
  const song_name = item.name
  const album_name = item.album.name
  const duration = millisToMinutesAndSeconds(item.duration_ms)
  
  return (
    <View style={styles.songContainer}>
      <View style={{ width: "10%", paddingLeft: 5 }}> 
        <Text style={styles.grayText}>{index + 1}</Text>
      </View>
      
      <Image style={styles.songCover} source={{ uri: image_url }} />
      <View style={{width: "35%", marginLeft: 10, marginRight: 10, flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
        <Text numberOfLines={1} style={styles.songText}>{song_name}</Text>
        <Text numberOfLines={1} style={styles.grayText}>{artist_name}</Text>
      </View>

      <View style={{width: "22%"}}>
        <Text numberOfLines={1} style={styles.songText}>{album_name}</Text>
      </View>
      <View style={{width: "10%", paddingRight: 5}}>
        <Text style={styles.songText}>{duration}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: Themes.colors.spotify,
    borderRadius: 99999,
  },
  spotifyIcon: {
    width: 15,
    aspectRatio: 1,
    marginRight: 5,
  },
  spotifyIconHeader: {
    width: 25,
    aspectRatio: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: '10%',
  },
  songContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  songCover: {
    width: 65,
    aspectRatio: 1
  },
  songText: {
    color: Themes.colors.white,
    fontFamily: "Helvetica",
  },
  grayText: {
    color: Themes.colors.gray
  },
});
