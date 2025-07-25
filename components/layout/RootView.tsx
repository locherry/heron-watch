import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface RootViewProps {
  children: React.ReactNode;
  className?: string; // Optional className prop for customization
}

const RootView: React.FC<RootViewProps> = ({
  // children,
  className,
  ...rest
}) => {
  return (
    <SafeAreaView
      // style={{ flex: 1 }}
      className={`flex-1 justify-start items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 ${className}`}
      {...rest}
    >
      {/* <View
        className={`flex-1 justify-start items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 ${className}`}
      > */}
      {/* <Card className="w-full h-full p-4">{children}</Card> */}
      {/* </View> */}
    </SafeAreaView>
  );
};

export default RootView;
