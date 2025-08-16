import { Asset } from "expo-asset";
import { t } from "i18next";
import React, { useState } from "react";
import { ActivityIndicator, Modal, ScrollView } from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { MarkdownViewer } from "~/components/MarkdownViewer"; // <- the component we built
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { capitalizeFirst } from "~/lib/utils";

const mdAsset = Asset.fromModule(
  require("~/assets/doc/legal_terms_of_services.md")
);

export default function LegalSettings() {
  const [showModal, setShowModal] = useState(false);
  const [uri, setUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    mdAsset.downloadAsync().then(() => setUri(mdAsset.localUri ?? mdAsset.uri));
  }, []);

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.legal.name"))} />

      <ScrollView className="flex-1 p-4 space-y-4">
        <Row className="items-center justify-between">
          <Text>{capitalizeFirst(t("settings.legal.termsOfService"))}</Text>
          <Button size="sm" variant="ghost" onPress={() => setShowModal(true)}>
            <Text>{t("common.open")}</Text>
          </Button>
        </Row>
      </ScrollView>

      {/* Modal for Terms of Service */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        {!uri ? (
          <ActivityIndicator className="flex-1" />
        ) : (
          <RootView className="flex-1 bg-background">
            <Header
              title={capitalizeFirst(t("settings.legal.termsOfService"))}
              onBack={() => setShowModal(false)}
            />
            {/* Full screen scrollable content */}
            <Card className="flex-1 p-4">
              <ScrollView className="p-4">
                <MarkdownViewer path={uri} />
              </ScrollView>
            </Card>
          </RootView>
        )}
      </Modal>
    </RootView>
  );
}
