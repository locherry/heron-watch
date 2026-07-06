import { useLocalSearchParams, useRouter } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "~/components/ui/toggle-group";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

type StockGlobalCategory = "PF" | "MP" | "EMB";

interface FormState {
  productCode: string;
  productName: string;
  productSpecificity: string;
  stockGroup: StockGlobalCategory;
}

interface FormErrors {
  productCode?: string;
  productName?: string;
  productSpecificity?: string;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      {children}
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View className="border-b border-border pb-2 mb-1">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </Text>
    </View>
  );
}

const specificityRegex: Record<StockGlobalCategory, RegExp> = {
  PF: /^[A-Z]{3}$/,
  MP: /^(F|C|S)$/,
  EMB: /^(Boite|Couvercle)$/,
};

export default function NewProduct() {
  const [t] = useTranslation();
  const router = useRouter();

  const rawParams = useLocalSearchParams();
  const { stockGroup: initialCategory = "PF" } = rawParams as {
    stockGroup?: StockGlobalCategory;
  };

  const [form, setForm] = useState<FormState>({
    productCode: "",
    productName: "",
    productSpecificity: "",
    stockGroup: initialCategory,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: createNewProduct, isPending } = useFetchMutation(
    "/api/products",
    "post",
    {
      onSuccess: () => router.back(),
    },
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.productCode.trim()) {
      newErrors.productCode = t("errors.required");
    } else if (!/^\d{3}.*$/.test(form.productCode)) {
      newErrors.productCode = t("errors.invalidProductCode");
    }

    if (!form.productName.trim()) {
      newErrors.productName = t("errors.required");
    }

    if (!form.productSpecificity.trim()) {
      newErrors.productSpecificity = t("errors.required");
    } else if (
      !specificityRegex[form.stockGroup].test(form.productSpecificity)
    ) {
      newErrors.productSpecificity = t(
        `errors.invalidProductSpecificity${form.stockGroup}`,
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createNewProduct({
      body: {
        product_code: form.productCode,
        product_name: form.productName,
        product_specificity: form.productSpecificity,
        stock_group: form.stockGroup,
      },
    });
  };

  const categoryLabels: Record<StockGlobalCategory, string> = {
    PF: t("stocks.PF"),
    MP: t("stocks.MP"),
    EMB: t("stocks.EMB"),
  };

  return (
    <RootView>
      <Header title={capitalizeFirst(t("product.newProduct"))} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Category */}
        <View className="gap-4">
          <SectionTitle>{t("product.category")}</SectionTitle>

          <FormField label={capitalizeFirst(t("stocks.stockGroup"))}>
            <ToggleGroup
              value={form.stockGroup}
              onValueChange={(v) =>
                v &&
                setForm((p) => ({
                  ...p,
                  stockGroup: v as StockGlobalCategory,
                  productSpecificity: "", // reset specificity when category changes
                }))
              }
              variant="outline"
              type="single"
            >
              {(["PF", "MP", "EMB"] as StockGlobalCategory[]).map((cat, i) => (
                <ToggleGroupItem
                  key={cat}
                  value={cat}
                  isFirst={i === 0}
                  isLast={i === 2}
                >
                  <ToggleGroupIcon as={Package} />
                  <Text>{categoryLabels[cat]}</Text>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormField>
        </View>

        {/* Product info */}
        <View className="gap-4">
          <SectionTitle>{t("product.information")}</SectionTitle>

          <FormField
            label={capitalizeFirst(t("product.productCode"))}
            error={errors.productCode}
          >
            <Input
              placeholder={capitalizeFirst(t("product.productCode"))}
              value={form.productCode}
              onChangeText={(v) => setForm((p) => ({ ...p, productCode: v }))}
              aria-invalid={!!errors.productCode}
            />
          </FormField>

          <FormField
            label={capitalizeFirst(t("product.productName"))}
            error={errors.productName}
          >
            <Input
              placeholder={capitalizeFirst(t("product.productName"))}
              value={form.productName}
              onChangeText={(v) => setForm((p) => ({ ...p, productName: v }))}
              aria-invalid={!!errors.productName}
            />
          </FormField>

          <FormField
            label={capitalizeFirst(t("product.productSpecificity"))}
            error={errors.productSpecificity}
          >
            <Input
              placeholder={
                form.stockGroup === "PF"
                  ? "ABC"
                  : form.stockGroup === "MP"
                    ? "F / C / S"
                    : "Boite / Couvercle"
              }
              value={form.productSpecificity}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, productSpecificity: v }))
              }
              aria-invalid={!!errors.productSpecificity}
            />
          </FormField>
        </View>

        {/* Actions */}
        <View className="flex-row justify-end gap-3 pt-2 pb-6">
          <Button
            variant="outline"
            onPress={() => router.back()}
            disabled={isPending}
          >
            <Text>{capitalizeFirst(t("common.cancel"))}</Text>
          </Button>
          <Button icon={Plus} onPress={handleSubmit} disabled={isPending}>
            <Text>{capitalizeFirst(t("product.newProduct"))}</Text>
          </Button>
        </View>
      </ScrollView>
    </RootView>
  );
}
