import { StyleSheet, Text, View } from "react-native";

import { ExternalLink } from "@/components/ExternalLink";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>expo-ig-reels-feed-example</Text>
      <Text style={styles.text}>
        2025 ©{" "}
        <ExternalLink style={styles.link} href="https://www.xavierbriole.com">
          Xavier Briole
        </ExternalLink>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
    color: "#ffffff",
  },
  link: {
    color: "#007aff",
  },
});
