# Heron Watch - Stock Management Solutions

Heron Watch is a React Native / Expo Router based application focused on providing a clean, customizable stock management interface. It supports cross-platform usage (iOS, Android, Web).

---

## Features

- **Multi-platform support:** Works on iOS, Android, and Web.
- **Theming:** Supports light and dark themes with React Navigation.
- **Localization:** Built-in i18n support with `react-i18next`.
- **API integration:** Typed API mutation hooks using `@tanstack/react-query` and OpenAPI-generated types.
- **Navigation:** Uses `expo-router` with tab-based navigation.
- **Authentication:** Custom auth flow that redirects unauthenticated users.

---

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/locherry/heron-watch.git
   cd heron-watch

## Project Structure

- **[/app](./app):** Contains routing and layout files following [Expo Router](https://expo.github.io/router/docs) conventions.
  
- **[/components](./components):** Reusable UI and layout components structured by function.
  - **[ui](./components/ui):** UI building blocks added via [react-native-reusables (rnr)](https://reactnativereusables.com/getting-started/introduction/) like `Button`, `Typography` (`H2`, `H4`, `P`), and `Table` components.
  - **[layout](./components/layout):** Components related to item placement and disposition such as `Row` and `Column`.
  - Other custom folders for feature-specific or grouped components.
  
- **[/lib](./lib):** Utility functions (e.g., `capitalizeFirst`, `cn`), custom hooks (`useAuth`, `useColorScheme`), icons (e.g., `House`, `Settings`), secure storage utilities, and app constants like theme colors.

- **[/translations](./translations):** i18n localization setup and resource files, using [i18next](https://www.i18next.com/).

- **[/assets](./assets):** Static media files including images and SVGs like the app icon.

- **[global.css](./global.css):** Global CSS for web platform styling, primarily used to set base styles and background colors, integrating Tailwind CSS.

---

### NativeWind Files Explanation

NativeWind enables Tailwind CSS style utilities in React Native. This project includes:

- **Tailwind config (`tailwind.config.js`):** Defines the design system (colors, spacing, fonts) and custom utilities for both web and native platforms.

- **Style usage in components:** Many components use `className` props with Tailwind classes (e.g., `flex-row`, `items-center`, `bg-muted/40`) supported by NativeWind to unify styling across platforms.

## Best Practices and Conventions

### 1. **Component Structure and Naming**
- Use **functional components** with React.FC or explicit function declarations.
- Keep component props fully typed with TypeScript interfaces or types for clarity and safety.
- Separate components into **UI primitives** (`/components/ui`) and **layout components** (`/components/layout`), maintaining clear responsibility.
- Use meaningful and descriptive component names (`Row`, `Column`, `SettingsEntry`, `ActionHistoryTable`, etc.).

### 2. **Styling**
- Prefer **NativeWind** (`className`) for styling to leverage Tailwind CSS utilities across native and web.
- Follow consistent Tailwind class naming conventions (`flex-row`, `items-center`, `bg-muted/40`).
- Use utility functions like `cn` (classNames) to conditionally join classes.

### 3. **Localization**
- Wrap all user-visible strings in `t()` for translation via `react-i18next`.
- Use helper functions like `capitalizeFirst` to maintain consistent UI text formatting.
- Organize translation keys by feature or screen for maintainability (e.g., `tabBar.settings`).

### 4. **Navigation and Routing**
- Use **Expo Router** conventions: folder-based routing, `<Tabs>` for tab navigation, and screen components named after their route.

### 5. **Code Organization**
- Keep hooks and utilities in `/lib` for centralized reuse.
- Use separate files for platform-specific code (`Alert.ts` + `Alert.web.ts`).
- Group icons and SVG assets in `/lib/icons` or `/assets`.

## Commit Message Conventions

To maintain clear, consistent, and informative commit history, follow these guidelines for commit messages:

### Structure

- **type**: Indicates the category or scope of the change.
- **short summary**: Brief description of the change.

### Common Types

- **UX:** Changes related to user experience or UI improvements.
- **UI:** Visual or interface updates, such as adding buttons, icons, or layout fixes.
- **API:** Backend API changes, including fetching, data handling, or integration updates.
- **TS:** Fixes or updates related to TypeScript types or errors.
- **DOC:** Documentation updates or comments.
- **TEST:** Adding or updating tests.

### Guidelines

- Prefix the subject with the type followed by a colon and a space, e.g., `API: Fix UseFetchQuery`.
- Use **imperative mood** in the subject line (e.g., “Fix translation errors” not “Fixed…” or “Fixes…”).
- Keep the subject line concise.

### Examples

- `UX: Move history in separate component`
- `TS: Fix translations errors`
- `API: Fix UseFetchQuery`

---

Following this convention ensures the commit history is easy to scan, understand, and trace, improving collaboration and code review efficiency.
