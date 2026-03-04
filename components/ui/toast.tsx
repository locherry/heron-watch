/**
 * /!\ Component not from rnr (react native reusables)
 * See react-native-toast-message doc for usage
 * 
 * Basic usage :
     Toast.show({
       type: "success",
       text1: "Success!",
       text2:
         "You have successfully completed the tutorial. You can now go touch some grass.",
     });
 */

import { AlertTriangle, CheckSquare, Info, X } from "lucide-react-native";
import * as React from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import Column from "../layout/Column";
import Row from "../layout/Row";
import { Button } from "./button";
import { Icon } from "./icon";

/**
 * @docs https://github.com/calintamas/react-native-toast-message/blob/main/docs/quick-start.md
 */

const TOAST_CONFIG: ToastConfig = {
  success: ({ text1, text2, onPress, props: { icon = CheckSquare } }) => (
    <Pressable onPress={onPress} className="w-full max-w-xl px-6">
      <Alert icon={icon} variant="success">
        <Row className="justify-between">
          <Column className="flex-1">
            <AlertTitle>{text1}</AlertTitle>
            <AlertDescription>{text2}</AlertDescription>
          </Column>
          <Button variant={"ghost"} onPress={() => Toast.hide()}>
            <Icon as={X} />
          </Button>
        </Row>
      </Alert>
    </Pressable>
  ),
  error: ({ text1, text2, onPress, props: { icon = AlertTriangle } }) => (
    <Pressable onPress={onPress} className="w-full max-w-xl px-6">
      <Alert icon={icon} variant="destructive">
        <Row className="justify-between">
          <Column className="flex-1">
            <AlertTitle>{text1}</AlertTitle>
            <AlertDescription>{text2}</AlertDescription>
          </Column>
          <Button variant={"ghost"} onPress={() => Toast.hide()}>
            <Icon as={X} />
          </Button>
        </Row>
      </Alert>
    </Pressable>
  ),
  info: ({ text1, text2, onPress, props: { icon = Info } }) => (
    <Pressable onPress={onPress} className="w-full max-w-xl px-6">
      <Alert icon={icon} variant="info">
        <Row className="justify-between">
          <Column className="flex-1">
            <AlertTitle>{text1}</AlertTitle>
            <AlertDescription>{text2}</AlertDescription>
          </Column>
          <Button variant={"ghost"} onPress={() => Toast.hide()}>
            <Icon as={X} />
          </Button>
        </Row>
      </Alert>
    </Pressable>
  ),
  base: ({ text1, text2, onPress, props: { icon = Info } }) => (
    <Pressable onPress={onPress} className="w-full max-w-xl px-6">
      <Alert icon={icon} variant="default">
        <Row className="justify-between">
          <Column className="flex-1">
            <AlertTitle>{text1}</AlertTitle>
            <AlertDescription>{text2}</AlertDescription>
          </Column>
          <Button variant={"ghost"} onPress={() => Toast.hide()}>
            <Icon as={X} />
          </Button>
        </Row>
      </Alert>
    </Pressable>
  ),
};

/**
 *
 * If you want to use a Toast in a Modal, you will need to add another `ToastPrivider` as a child of the Modal.
 */
function ToastProvider() {
  const insets = useSafeAreaInsets();
  return (
    <Toast
      config={TOAST_CONFIG}
      topOffset={insets.top + 20}
      bottomOffset={insets.bottom}
    />
  );
}

export { ToastProvider };
