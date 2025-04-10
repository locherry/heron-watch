import { Banner } from "@/components/Brand/Banner";
import { Card } from "@/components/Card";
import { Column } from "@/components/Column";
import RootView from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/Themed/ThemedText";
import { ThemeContext } from "@react-navigation/native";
import { Link } from "expo-router";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <RootView>
      <Column style={styles.container} gap={24}>
        <Banner />
        <Card style={styles.card}>
          <ThemedText variant="h2">Welcome to Heron !</ThemedText>

          <Row gap={32}>
            <Column>
              <ThemedText>Follow right where you left :</ThemedText>
              <Link style={styles.btn} href='/login' asChild>
                <Button title="login"></Button>
              </Link>
            </Column>

            <Column>
              <ThemedText>New to Heron ?</ThemedText>
              <Link style={styles.btn} href='/login' asChild>
                <Button title="Let's make a tour"></Button>
              </Link>
            </Column>
          </Row>
          <ThemedText>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur perspiciatis similique earum nobis omnis consectetur maxime accusamus vel quisquam, nesciunt alias commodi, quae molestiae necessitatibus laudantium autem voluptatem atque suscipit!</ThemedText>
          <ThemedText>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur perspiciatis similique earum nobis omnis consectetur maxime accusamus vel quisquam, nesciunt alias commodi, quae molestiae necessitatibus laudantium autem voluptatem atque suscipit!</ThemedText>

          <ThemedText>Made with ❤️ by Ellande & Aloys || All rights reserved</ThemedText>

        </Card>
      </Column>
    </RootView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100
  },
  img: {
    width: 410,
    height: 135
  },
  card: {
    padding: 16,
    gap:16,
    // flex:1,
    width: "100%",
    alignItems: "center"
  },
  btn: {
    flex:1,
    overflow:"hidden"
  }
})