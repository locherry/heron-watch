# Welcome to Heron-Watch* Inc !
*(a dumb name to test branding)
### This is a simple React-native & Expo app, that aims to provide a comprehensive way of dealing with stock management

## To do (le loup)
- [X] login/logout
- [X] Theme / custom tint color support
- [X] implement translations
- [ ] extend useFetchQuery for infinite fetchs
- [X] Scan QR
- [ ] Scync stored preferences on the server
- [X] useAuth()
- [ ] new action form, and auto fill thanks to QR code

## Best practices :
### TypeScript
- no JS allowed only TS and TSX (exeption for ./scripts/ because run by node)
- try to use more "satisfies" keyword than "as"
- define Types only once

### Expo related stuff
- for adding screens in ./app/ please follow the Expo notation : https://docs.expo.dev/router/basics/notation/
- When adding dependencies run "npx expo install package-name" instead of "npm install package-name", to ensures that expo manages compatibility
- Try to use the expo versions of librairies if available (e.g. expo-camera, expo-secure-storage, ...)

### Naming
- use camelCase in JS variables name
- component names should begin with a capital letter
