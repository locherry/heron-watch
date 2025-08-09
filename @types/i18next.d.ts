// Import translation files
import mainEN from '../translations/EN/main.json';

// Declare module and extend types
declare module 'i18next' {
  interface CustomTypeOptions {
    // Set the default namespace if necessary
    defaultNS: 'main';
    // Define the resources object with type inference
    resources: {
      main: typeof mainEN;  // Type the 'main' namespace based on JSON file
    };
  }
}