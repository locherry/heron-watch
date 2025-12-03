# Heron Watch - Stock Management Solutions

Heron Watch is a React Native / Expo Router based application focused on providing a clean, customizable stock management interface. It supports cross-platform usage (iOS, Android, Web).

<span style="display:flex; gap:8px;">

  [![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

  [![React native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)

  <a href="https://reactnativereusables.com" style="display:flex;height:20px; padding:4px; gap:8px; background-color:#111; align-items:center; text-decoration:none; color:white">
    <svg style="width:16px" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5" shape-rendering="geometricPrecision"><path d="M15.2858 11.4777L13.0001 13.7131M14.8287 9.01884L10.4858 13.266M13.0001 16.7794C19.6275 16.7794 25 14.4158 25 11.5C25 8.5843 19.6275 6.22068 13.0001 6.22068C6.37276 6.22068 1 8.5843 1 11.5C1 14.4158 6.37276 16.7794 13.0001 16.7794ZM8.3235 14.1397C11.6373 19.751 16.4172 23.1179 18.9999 21.6602C21.5829 20.2022 20.9903 14.4714 17.6765 8.86036C14.3629 3.24884 9.58282 -0.118067 7.00028 1.33992C4.41729 2.79768 5.00994 8.52842 8.3235 14.1397ZM8.3235 8.86036C5.00994 14.4717 4.41751 20.2022 7.00006 21.6602C9.58305 23.1179 14.3629 19.7508 17.6765 14.1397C20.9903 8.52821 21.5829 2.7979 19.0002 1.33992C16.4172 -0.118067 11.6373 3.24907 8.3235 8.86036Z" stroke="currentColor" stroke-linecap="round" class="stroke-[1.2px]"></path></svg>
    React Native Reusables
  </a>

  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</span>

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

## Deployment
1. Mobile:
    ```bash
    npx eas build -p android --profile preview

2. Web:
    ```bash
    npx eas deploy

## Project Structure

- **[/app](./app):** Contains routing and layout files following [Expo Router](https://expo.github.io/router/docs) conventions.
  
- **[/components](./components):** Reusable UI and layout components structured by function.
  - **[ui](./components/ui):** UI building blocks added via [react-native-reusables (rnr)](https://reactnativereusables.com/getting-started/introduction/) like `Button`, and `Table` components.
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
- Group icons and SVG assets in `/assets/images/icons` or `/assets/images`.

### 6. **Commit Message Conventions**

To maintain clear, consistent, and informative commit history, follow these guidelines for commit messages:

#### Structure

- **type**: Indicates the category or scope of the change.
- **short summary**: Brief description of the change.

#### Common Types

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
