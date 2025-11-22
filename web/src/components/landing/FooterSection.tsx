import { t, Language } from '../../i18n/translations'

interface FooterSectionProps {
  language: Language
}

export default function FooterSection({ language }: FooterSectionProps) {
  return (
    <footer className="border-t border-darkmoon-border bg-darkmoon-surface/50 backdrop-blur-lg">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12">
          <img src="/icons/nofx.svg" alt="DarkMoon Logo" className="w-8 h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <div>
            <div className="text-lg font-bold text-darkmoon-text-primary">
              DarkMoon
            </div>
            <div className="text-xs text-darkmoon-text-muted">
              {t('futureStandardAI', language)}
            </div>
          </div>
        </div>

        {/* Multi-link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-sm font-bold mb-6 text-darkmoon-text-primary uppercase tracking-wider">
              {t('links', language)}
            </h3>
            <ul className="space-y-4 text-sm text-darkmoon-text-secondary">
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://github.com/tinkle-community/nofx" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://t.me/nofx_dev_community" target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://x.com/nofx_official" target="_blank" rel="noopener noreferrer">
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-6 text-darkmoon-text-primary uppercase tracking-wider">
              {t('resources', language)}
            </h3>
            <ul className="space-y-4 text-sm text-darkmoon-text-secondary">
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://github.com/tinkle-community/nofx/blob/main/README.md" target="_blank" rel="noopener noreferrer">
                  {t('documentation', language)}
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://github.com/tinkle-community/nofx/issues" target="_blank" rel="noopener noreferrer">
                  Issues
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://github.com/tinkle-community/nofx/pulls" target="_blank" rel="noopener noreferrer">
                  Pull Requests
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-6 text-darkmoon-text-primary uppercase tracking-wider">
              {t('supporters', language)}
            </h3>
            <ul className="space-y-4 text-sm text-darkmoon-text-secondary">
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://www.asterdex.com/en/referral/fdfc0e" target="_blank" rel="noopener noreferrer">
                  Aster DEX
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://www.maxweb.red/join?ref=NOFXAI" target="_blank" rel="noopener noreferrer">
                  Binance
                </a>
              </li>
              <li>
                <a className="hover:text-darkmoon-gold transition-colors" href="https://hyperliquid.xyz/" target="_blank" rel="noopener noreferrer">
                  Hyperliquid
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <div className="pt-8 mt-12 text-center text-xs text-darkmoon-text-muted border-t border-darkmoon-border/50">
          <p className="font-medium mb-2">{t('footerTitle', language)}</p>
          <p className="opacity-60 max-w-3xl mx-auto">{t('footerWarning', language)}</p>
        </div>
      </div>
    </footer>
  )
}
