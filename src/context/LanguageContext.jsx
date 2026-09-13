import { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

/*
 * LANGUAGE SELECTOR
 *
 * English / Hindi only control the text shown
 * inside the language selector.
 *
 * They DO NOT translate the website.
 * They DO NOT change any other website content.
 */

export function LanguageProvider({ children }) {
  // Default language shown in the selector
  const [language, setLanguageState] = useState('English')

  // Change only the selected language value
  const setLanguage = (next) => {
    if (next === 'Hindi') {
      setLanguageState('Hindi')
    } else {
      setLanguageState('English')
    }
  }

  /*
   * t() intentionally returns the original text.
   *
   * This means:
   * t('Home') → Home
   * t('Marketplace') → Marketplace
   *
   * Nothing else on the website gets translated.
   */
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text) => text,
    }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
