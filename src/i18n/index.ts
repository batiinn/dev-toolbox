import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from './tr.json'
import en from './en.json'

const STORAGE_KEY = 'devtoolbox-lang'
const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: saved ?? 'tr',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lng)
  if (typeof document !== 'undefined') document.documentElement.lang = lng
})

export default i18n
