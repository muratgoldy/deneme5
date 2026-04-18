import { useLanguage } from '../LanguageContext.jsx'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <p>{t('footer_main')}</p>
      <p className="footer-sub">{t('footer_sub')}</p>
    </footer>
  )
}
