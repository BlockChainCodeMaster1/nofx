import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'
import { Container } from './Container'

interface HeaderProps {
  simple?: boolean // For login/register pages
}

export function Header({ simple = false }: HeaderProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="sticky top-0 z-50 bg-darkmoon-bg/80 backdrop-blur-xl border-b border-darkmoon-border">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          {/* Left - Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center transition-transform hover:scale-110">
              <img src="/icons/nofx.svg" alt="DarkMoon Logo" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkmoon-gold to-[#F3CF55]">
                DarkMoon
              </h1>
              {!simple && (
                <p className="text-xs font-mono text-darkmoon-text-muted">
                  {t('subtitle', language)}
                </p>
              )}
            </div>
          </div>

          {/* Right - Language Toggle (always show) */}
          <div className="flex gap-1 rounded p-1 bg-darkmoon-surface border border-darkmoon-border">
            <button
              onClick={() => setLanguage('zh')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                language === 'zh'
                  ? 'bg-darkmoon-gold text-black shadow-sm'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-darkmoon-gold text-black shadow-sm'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
