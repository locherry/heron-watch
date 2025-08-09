import { AlertButton, AlertOptions, AlertStatic } from "react-native";

/**
 * Custom Alert implementation for web using window.confirm
 * This mimics the native Alert API but adapts it to browser dialogs.
 */
const Alert: AlertStatic = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => {
    // Combine title and message for the browser confirm dialog
    const result = window.confirm([title, message].filter(Boolean).join("\n"));

    if (result) {
      // User pressed "OK" in the confirm dialog
      // Call the onPress handler of the first button that is NOT a cancel button
      const confirmButton = buttons?.find((button) => button.style !== "cancel");
      confirmButton?.onPress?.();
    } else {
      // User pressed "Cancel" in the confirm dialog
      // Call the onPress handler of the cancel button if any
      const cancelButton = buttons?.find((button) => button.style === "cancel");
      cancelButton?.onPress?.();
    }
  },

  prompt: () => {
    // Not supported yet in this web implementation
    console.warn("Prompt is currently not supported on web.");
  },
};

export { Alert };