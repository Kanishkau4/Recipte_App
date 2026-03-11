import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen 123.</Text>

      <Image source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }} style={{ width: 100, height: 100 }} />
      <TouchableOpacity>
        <Text>Submit</Text>
      </TouchableOpacity>
      <Link href="/about">
        <Text>About Screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "red", fontSize: 20 }
});
