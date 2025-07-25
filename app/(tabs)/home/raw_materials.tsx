import { t } from "i18next";
import * as React from "react";
import { View } from "react-native";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";
import { H3, P } from "~/components/ui/typography";
import { Package } from "~/lib/icons/Package";
import { Plus } from "~/lib/icons/Plus";
import { capitalizeFirst } from "~/lib/utils";

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
      <H3>{capitalizeFirst(t("common.history"))}</H3>
      <P>Action table here ...</P>
    </RootView>
  );
}
