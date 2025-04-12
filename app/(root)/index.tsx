import { Banner } from "@/components/Brand/Banner";
import { Card } from "@/components/ui/Card";
import { Column } from "@/components/ui/Column";
import RootView from "@/components/RootView";
import { Row } from "@/components/ui/Row";
import { ThemedText } from "@/components/Themed/ThemedText";
import { ThemeContext } from "@react-navigation/native";
import { Link } from "expo-router";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { SecureStorage } from "@/class/SecureStorage";

export default function Index() {
  SecureStorage.initializeDefaults()
  
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

      <View style={styles.cattail}>
        <Image
          source={require('@/assets/images/Cattail_flowers_Silouhette.svg')}
          style={styles.cattail}
        />
      </View>
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
    gap: 16,
    // flex:1,
    width: "100%",
    alignItems: "center"
  },
  btn: {
    flex: 1,
    overflow: "hidden"
  },
  cattail: {
    position: 'absolute',
    // backgroundColor: 'red',
    // backgroundSize: '100%',
    // backgroundPosition:'cover',

    bottom: 0,
    right: 0,
    left: 0,
    height: 400,
    aspectRatio: 90, // Replace with your image's actual width/height ratio

  }
})