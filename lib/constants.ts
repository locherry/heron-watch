import {
  Factory,
  Gift,
  Leaf,
  Package,
  Snowflake,
  Store,
  Sun,
  Tag,
} from "lucide-react-native";

export const constants = {
  appName: "Heron Watch",
  stockCategories: ["PF_G", "PF_M", "MP_F", "MP_S", "MP_C", "EMB"],
  stockCategoryIcon: {
    PF_G: Factory,
    PF_M: Store,
    MP_F: Leaf,
    MP_S: Sun,
    MP_C: Snowflake,
    EMB: Package,
  },
  actionTypes: [
    { value: "1", label: "I stock", icon: Package, additionRule: "+" },
    { value: "2", label: "I sell", icon: Tag, additionRule: "-" },
    { value: "3", label: "I Give", icon: Gift, additionRule: "-" },
    {
      value: "4",
      label: "I Transfer to the shop",
      icon: Store,
      additionRule: "-",
    },
  ],
  fontSizeOptions: [
    { value: "small", size: 14 },
    { value: "medium", size: 16 },
    { value: "large", size: 18 },
  ] as const,
} as const;
