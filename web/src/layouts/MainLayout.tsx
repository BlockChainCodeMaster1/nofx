import { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import HeaderBar from '../components/HeaderBar'
import { Container } from '../components/Container'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { t } from '../i18n/translations'

interface MainLayoutProps {
  children?: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const location = useLocation()

  // 根据路径自动判断当前页面
  const getCurrentPage = (): 'competition' | 'traders' | 'trader' | 'faq' => {
    if (location.pathname === '/faq') return 'faq'
    if (location.pathname === '/traders') return 'traders'
    if (location.pathname === '/dashboard') return 'trader'
    if (location.pathname === '/competition') return 'competition'
    return 'competition' // 默认
  }

  return (
    <div className="min-h-screen bg-darkmoon-bg text-darkmoon-text-primary font-sans selection:bg-darkmoon-gold selection:text-black">
      <HeaderBar
        isLoggedIn={!!user}
        currentPage={getCurrentPage()}
        language={language}
        onLanguageChange={setLanguage}
        user={user}
        onLogout={logout}
        onPageChange={() => {
          // React Router handles navigation now
        }}
      />

      {/* Main Content */}
      <Container as="main" className="py-6 pt-24 min-h-[calc(100vh-200px)] relative z-10">
        {children || <Outlet />}
      </Container>

      {/* Footer */}
      <footer className="mt-16 border-t border-darkmoon-border bg-darkmoon-surface py-12 relative z-10">
        <Container className="text-center text-sm text-darkmoon-text-muted">
          <p className="font-medium text-darkmoon-text-secondary mb-4">{t('footerTitle', language)}</p>
          <p className="opacity-60 max-w-2xl mx-auto">{t('footerWarning', language)}</p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://github.com/tinkle-community/nofx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 bg-darkmoon-bg border border-darkmoon-border hover:border-darkmoon-gold hover:text-darkmoon-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </Container>
      </footer>
    </div>
  )
}
