import React from 'react';
import { StyleSheet, SafeAreaView, Text, FlatList, Pressable, View, Image } from "react-native";
import { useSpotifyAuth, millisToMinutesAndSeconds } from "./utils";
import { Images, Themes } from "./assets/Themes";
import Ionicons from '@expo/vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const Stack = createStackNavigator()

export default function App() {
  // Pass in true to useSpotifyAuth to use the album ID (in env.js) instead of top tracks
  const { token, tracks, getSpotifyAuth } = useSpotifyAuth()
  
  let contentDisplayed = null;

  function HomeScreen({navigation}) {
    if (token) {
      contentDisplayed = <Playlist navigation={navigation}  tracks={tracks} />
    } else {
      contentDisplayed = <ConnectButton getSpotifyAuth={getSpotifyAuth} />
    }

    return (
      <SafeAreaView style={styles.container}>
        {contentDisplayed}
      </SafeAreaView>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SongDetail" component={SongDetailScreen} />
        <Stack.Screen name="SongPreview" component={SongPreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const ConnectButton = ({ getSpotifyAuth }) => {
  return (
    <View>
      <Pressable onPress={getSpotifyAuth}>
        <View style={styles.buttonContainer}>
          <Image style={styles.spotifyIcon} source={Images.spotify} />
          <Text style={{ color: 'white', fontFamily: "Helvetica", fontWeight: 'bold' }}>CONNECT WITH SPOTIFY</Text>
        </View>
      </Pressable>
    </View>
  );
}

const Playlist = ({ navigation, tracks }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.spotifyIconHeader} source={Images.spotify} />
        <Text style={{ color: 'white', fontSize: 22, fontFamily: "Helvetica", fontWeight: 'bold' }}>My Top Tracks</Text>
      </View>
      <FlatList scroll={true} data={tracks} renderItem={({ item }) => RenderTrack(item, navigation)} keyExtractor={(item) => item.id} />
    </SafeAreaView>
  )
}

// renderItem={({ index, item }) => RenderTrack(navigation, index, item)}
const RenderTrack = (item, navigation) => {  // renders one song
  const image_url = item.album.images[0].url;
  const artist_name = item.album.artists[0].name;
  const song_name = item.name;
  const album_name = item.album.name;
  const duration = millisToMinutesAndSeconds(item.duration_ms);
  const song_external_url = item.external_urls.spotify;
  const song_preview_url = item.preview_url;

  return (
    <Pressable onPress={() => navigation.navigate("SongDetail", { external_url: song_external_url })}>
      <View style={styles.songContainer}>
        <View style={{ width: "10%", paddingLeft: 5 }}>
          <Pressable onPress={(e) => { e.stopPropagation(); navigation.navigate("SongPreview", { preview_url: song_preview_url }) }}>
            <Ionicons name="md-play-circle" size={20} color={Themes.colors.spotify} />
          </Pressable>
        </View>

        <Image style={styles.songCover} source={{ uri: image_url }} />
        <View style={{ width: "35%", marginLeft: 10, marginRight: 10, flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <Text numberOfLines={1} style={styles.songText}>{song_name}</Text>
          <Text numberOfLines={1} style={styles.grayText}>{artist_name}</Text>
        </View>

        <View style={{ width: "22%" }}>
          <Text numberOfLines={1} style={styles.songText}>{album_name}</Text>
        </View>
        <View style={{ width: "10%", paddingRight: 5 }}>
          <Text style={styles.songText}>{duration}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const SongDetailScreen = ({ navigation, route }) => {
  const { external_url } = route.params;
  return (
    <WebView source={{ uri: external_url }} />
  )
}

const SongPreviewScreen = ({ navigation, route }) => {
  const { preview_url } = route.params;
  return (
    <WebView source={{ uri: preview_url }} />
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
