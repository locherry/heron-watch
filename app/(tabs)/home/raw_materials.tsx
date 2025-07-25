import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";
import { H3 } from "~/components/ui/typography";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";

export default function TabsScreen() {
  return (
    <RootView>
      <H3>{t('Raw materials')}</H3>
      <View className="flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button icon={Package} variant="outline" size="default">
          {t('View stocks')}
        </Button>
        <Button icon={Plus} variant="outline">
          {t('New actions')}
        </Button>
      </View>
    </RootView>
  );
}
