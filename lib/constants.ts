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
    { value: "1", label: "actions.1", icon: Package, additionRule: "+" },
    { value: "2", label: "actions.2", icon: Tag, additionRule: "-" },
    { value: "3", label: "actions.3", icon: Gift, additionRule: "-" },
    { value: "4", label: "actions.4", icon: Store, additionRule: "-" },
  ],
} as const;
