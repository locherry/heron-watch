import { AlertButton, AlertOptions, AlertStatic } from "react-native";

const Alert: AlertStatic = {
    alert: (
        title: string,
        message?: string,
        buttons?: AlertButton[],
        options?: AlertOptions
    ) => {
        // Display a confirmation dialog
        const result = window.confirm([title, message].filter(Boolean).join("\n"));

        if (result) {
            // Handle "OK" or "confirm" button press
            const confirmButton = buttons?.find((button) => button.style !== "cancel");
            confirmButton?.onPress?.();
        } else {
            // Handle "Cancel" button press
            const cancelButton = buttons?.find((button) => button.style === "cancel");
            cancelButton?.onPress?.();
        }
    },

    prompt: () => {
        // Implement prompt functionality later
        console.warn("Prompt is currently not supported on web.");
    },
};

export { Alert };