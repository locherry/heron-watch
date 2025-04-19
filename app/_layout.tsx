import { ThemeProvider } from '@/contexts/ThemeContext';
import { Slot } from 'expo-router';
import React, { Suspense, useEffect } from 'react';

// import i18n (needs to be bundled ;))
import '../translations/i18n';
import { SecureStorage } from '@/classes/SecureStorage';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const {i18n} = useTranslation()
  useEffect(()=>{
    SecureStorage.get("preferences").then(
      prefs => {
        prefs? i18n.changeLanguage(prefs.language) : null
      }
    )
  }, [])
  return <React.StrictMode>
    {/* <Suspense fallback="...is loading"> */}
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    {/* </Suspense> */}
  </React.StrictMode>
}