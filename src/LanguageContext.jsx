import { createContext, useContext, useState } from 'react'
import { locales, defaultLang } from './locales.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('brightday-lang') || defaultLang
  )

  const t = (key, vars = {}) => {
    const val = locales[lang]?.[key] ?? locales[defaultLang]?.[key] ?? key
    if (typeof val !== 'string') return val
    return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), val)
  }

  const setLanguage = (newLang) => {
    setLang(newLang)
    localStorage.setItem('brightday-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
