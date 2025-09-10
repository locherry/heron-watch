import { Factory, Leaf, Package, Snowflake, Store, Sun } from "lucide-react-native";

export const constants = {
    stockCategories : ["PF_G", "PF_M", "MP_F", "MP_S", "MP_C", "EMB"],
    stockCategoryIcon : {
        "PF_G": Factory,
        "PF_M": Store,
        "MP_F": Leaf,
        "MP_S": Sun,
        "MP_C": Snowflake,
        "EMB": Package
    }
} as const;