
import { useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { useState } from "react";
import { Text, View } from "react-native";
import RootView from "~/components/layout/RootView";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { capitalizeFirst } from "~/lib/utils";



export default function App() {

    const rawParams = useLocalSearchParams(); //We take params from url that have been used to go to this page
    const { stockGlobalCategory = "PF" } = rawParams as {
      stockGlobalCategory?: "PF" | "MP" | "EMB";
    };
    const [errors, setErrors] = useState<Record<string,string>>({});
    const INPUT_FIELDS = (() => {
      let INPUT_FIELDS_CREATE = [
        {
            label : capitalizeFirst(t("product_category.product_code")),
            id : 1,
            regex: /^\d{3}.*$/,
            errorMessage : capitalizeFirst(t("errors.invalidProductCode")),
        },
        {
            label : capitalizeFirst(t("product_category.product_name")),
            id :2,
            regex: /^.*$/,
            errorMessage : capitalizeFirst(t("errors.invalidProductCode")),
        }
      ];

      if (stockGlobalCategory === "PF") {
        INPUT_FIELDS_CREATE.push({
          label : capitalizeFirst(t("product_category.product_specificity")),
          id : 3,
          regex : /^(A-Z){3}$/,
          errorMessage : capitalizeFirst(t("errors.invalidProductSpecificityPF"))
        })
      }
      else if (stockGlobalCategory === "MP") {
        INPUT_FIELDS_CREATE.push({
          label : capitalizeFirst(t("product_category.product_specificity")),
          id : 3,
          regex : /^(F|C|S)$/,
          errorMessage : capitalizeFirst(t("errors.invalidProductSpecificityPF"))
        })
      } else if (stockGlobalCategory === "EMB") {
        INPUT_FIELDS_CREATE.push({
          label : capitalizeFirst(t("product_category.product_specificity")),
          id : 3,
          regex : /^(Boite|Couvercle)$/,
          errorMessage : capitalizeFirst(t("errors.invalidProductSpecificityPF"))
        })
      }

      return INPUT_FIELDS_CREATE;
    })();
    const checkValidity = (id : number ,text : string) => {
      const field = INPUT_FIELDS.find((f) => f.id === id);
      if (!field) return "";
      if (text && field.regex && !field.regex.test(text))
      return field.errorMessage;
      return "";
    }

    const handleChange = (id: number, value: string) => {
      setErrors((prev) => ({ ...prev, [id]: checkValidity(id, value) }));
    };

  return (
    <RootView>
    {INPUT_FIELDS.map((field) => {
            const error = errors[field.id] 
            return (
              <View key={field.id} className="mb-2">
                <Label>{field.label}</Label>
                <Input
                  className={`w-full ${error ? "border-red-500" : ""}`}
                  onChangeText={(text) => checkValidity(field.id, text)}
                />
                {error ? (
                  <Text className="text-red-500 text-xs mt-1">{error}</Text>
                ) : null}
              </View>
            );
          })}
    </RootView>
  );
}