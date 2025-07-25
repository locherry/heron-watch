import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../ui/card";

interface RootViewProps {
  children: React.ReactNode;
  className?: string; // Optional className prop for customization
}

const RootView: React.FC<RootViewProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <SafeAreaView
      // style={{ flex: 1 }}
      className={`w-full h-full flex-1 justify-start items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 ${className}`}
      {...rest}
    >
      <Card className="w-full h-full p-4">
      {children}
      </Card>
    </SafeAreaView>
  );
};

export default RootView;
