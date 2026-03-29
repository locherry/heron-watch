import { Link, router } from "expo-router";
import { View } from "react-native";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Not found</Text>
      <Row gap={16}>
        <Link asChild href={"/home"}>
          <Button> Go home</Button>
        </Link>
        <Button
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
          disabled={!router.canGoBack()}
        >
          Go back
        </Button>
      </Row>
    </View>
  );
}
