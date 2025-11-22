import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { t, type Language } from '../i18n/translations'
import { Container } from './Container'
import { useSystemConfig } from '../hooks/useSystemConfig'

interface HeaderBarProps {
  onLoginClick?: () => void
  isLoggedIn?: boolean
  isHomePage?: boolean
  currentPage?: string
  language?: Language
  onLanguageChange?: (lang: Language) => void
  user?: { email: string } | null
  onLogout?: () => void
  onPageChange?: (page: string) => void
}

export default function HeaderBar({
  isLoggedIn = false,
  isHomePage = false,
  currentPage,
  language = 'zh' as Language,
  onLanguageChange,
  user,
  onLogout,
  onPageChange,
}: HeaderBarProps) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const { config: systemConfig } = useSystemConfig()
  const registrationEnabled = systemConfig?.registration_enabled !== false

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false)
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const NavButton = ({ page, label, onClick }: { page: string, label: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`text-sm font-bold transition-all duration-300 relative px-4 py-2 rounded-lg ${
        currentPage === page
          ? 'text-darkmoon-gold'
          : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
      }`}
    >
      {currentPage === page && (
        <span className="absolute inset-0 rounded-lg bg-darkmoon-gold/10 -z-10" />
      )}
      {label}
    </button>
  )

  const NavLink = ({ page, label, href }: { page: string, label: string, href: string }) => (
    <a
      href={href}
      className={`text-sm font-bold transition-all duration-300 relative px-4 py-2 rounded-lg ${
        currentPage === page
          ? 'text-darkmoon-gold'
          : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
      }`}
    >
      {currentPage === page && (
        <span className="absolute inset-0 rounded-lg bg-darkmoon-gold/10 -z-10" />
      )}
      {label}
    </a>
  )

  return (
    <nav className="fixed top-0 w-full z-50 bg-darkmoon-bg/80 backdrop-blur-md border-b border-darkmoon-border">
      <Container className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <img src="/icons/nofx.svg" alt="DarkMoon Logo" className="w-8 h-8 transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkmoon-gold to-[#F3CF55]">
            DarkMoon
          </span>
          <span className="text-xs hidden sm:block text-darkmoon-text-muted font-mono">
            Agentic Trading OS
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
          {/* Left Side - Navigation Tabs */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <NavButton 
                  page="competition" 
                  label={t('realtimeNav', language)} 
                  onClick={() => navigate('/competition')} 
                />
                <NavButton 
                  page="traders" 
                  label={t('configNav', language)} 
                  onClick={() => navigate('/traders')} 
                />
                <NavButton 
                  page="trader" 
                  label={t('dashboardNav', language)} 
                  onClick={() => navigate('/dashboard')} 
                />
                <NavButton 
                  page="faq" 
                  label={t('faqNav', language)} 
                  onClick={() => onPageChange ? onPageChange('faq') : navigate('/faq')} 
                />
              </>
            ) : (
              <>
                <NavLink page="competition" label={t('realtimeNav', language)} href="/competition" />
                <NavLink page="faq" label={t('faqNav', language)} href="/faq" />
              </>
            )}
          </div>

          {/* Right Side - Original Navigation Items and Login */}
          <div className="flex items-center gap-6">
            {isHomePage &&
              [
                { key: 'features', label: t('features', language) },
                { key: 'howItWorks', label: t('howItWorks', language) },
                { key: 'GitHub', label: 'GitHub' },
                { key: 'community', label: t('community', language) },
              ].map((item) => (
                <a
                  key={item.key}
                  href={
                    item.key === 'GitHub'
                      ? 'https://github.com/tinkle-community/nofx'
                      : item.key === 'community'
                        ? 'https://t.me/nofx_dev_community'
                        : `#${item.key === 'features' ? 'features' : 'how-it-works'}`
                  }
                  target={item.key === 'GitHub' || item.key === 'community' ? '_blank' : undefined}
                  rel={item.key === 'GitHub' || item.key === 'community' ? 'noopener noreferrer' : undefined}
                  className="text-sm transition-colors relative group text-darkmoon-text-secondary hover:text-darkmoon-gold"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-darkmoon-gold group-hover:w-full transition-all duration-300" />
                </a>
              ))}

            {/* User Info and Actions */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-darkmoon-surface border border-darkmoon-border hover:bg-darkmoon-surface-hover"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-darkmoon-gold text-black">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-darkmoon-text-primary">
                      {user.email}
                    </span>
                    <ChevronDown className="w-4 h-4 text-darkmoon-text-muted" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-50 bg-darkmoon-surface border border-darkmoon-border">
                      <div className="px-3 py-2 border-b border-darkmoon-border">
                        <div className="text-xs text-darkmoon-text-muted">
                          {t('loggedInAs', language)}
                        </div>
                        <div className="text-sm font-medium text-darkmoon-text-primary truncate">
                          {user.email}
                        </div>
                      </div>
                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout()
                            setUserDropdownOpen(false)
                          }}
                          className="w-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-darkmoon-surface-hover text-darkmoon-error text-center"
                        >
                          {t('exitLogin', language)}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              currentPage !== 'login' &&
              currentPage !== 'register' && (
                <div className="flex items-center gap-3">
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm font-medium transition-colors rounded text-darkmoon-text-secondary hover:text-darkmoon-text-primary hover:bg-darkmoon-surface"
                  >
                    {t('signIn', language)}
                  </a>
                  {registrationEnabled && (
                    <a
                      href="/register"
                      className="px-5 py-2 rounded font-bold text-sm transition-all bg-darkmoon-gold text-black hover:bg-[#F3CF55] shadow-lg hover:shadow-darkmoon-gold/20 hover:-translate-y-0.5"
                    >
                      {t('signUp', language)}
                    </a>
                  )}
                </div>
              )
            )}

            {/* Language Toggle */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-darkmoon-text-secondary hover:text-darkmoon-text-primary hover:bg-darkmoon-surface"
              >
                <span className="text-lg">
                  {language === 'zh' ? '🇨🇳' : '🇺🇸'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg shadow-xl overflow-hidden z-50 bg-darkmoon-surface border border-darkmoon-border">
                  <button
                    onClick={() => {
                      onLanguageChange?.('zh')
                      setLanguageDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 transition-colors ${
                      language === 'zh' 
                        ? 'bg-darkmoon-gold/10 text-darkmoon-gold' 
                        : 'text-darkmoon-text-secondary hover:bg-darkmoon-surface-hover'
                    }`}
                  >
                    <span className="text-base">🇨🇳</span>
                    <span className="text-sm">中文</span>
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange?.('en')
                      setLanguageDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 transition-colors ${
                      language === 'en' 
                        ? 'bg-darkmoon-gold/10 text-darkmoon-gold' 
                        : 'text-darkmoon-text-secondary hover:bg-darkmoon-surface-hover'
                    }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span className="text-sm">English</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-darkmoon-text-secondary"
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.button>
      </Container>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={
          mobileMenuOpen
            ? { height: 'auto', opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-darkmoon-surface border-t border-darkmoon-gold/10"
      >
        <div className="px-4 py-4 space-y-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  onPageChange?.('competition')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left text-sm font-bold px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'competition'
                  ? 'text-darkmoon-gold bg-darkmoon-gold/10'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
                }`}
              >
                {t('realtimeNav', language)}
              </button>
              <button
                onClick={() => {
                  if (onPageChange) onPageChange('traders')
                  else navigate('/traders')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left text-sm font-bold px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'traders'
                  ? 'text-darkmoon-gold bg-darkmoon-gold/10'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
                }`}
              >
                {t('configNav', language)}
              </button>
              <button
                onClick={() => {
                  if (onPageChange) onPageChange('trader')
                  else navigate('/dashboard')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left text-sm font-bold px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'trader'
                  ? 'text-darkmoon-gold bg-darkmoon-gold/10'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
                }`}
              >
                {t('dashboardNav', language)}
              </button>
              <button
                onClick={() => {
                  if (onPageChange) onPageChange('faq')
                  else navigate('/faq')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left text-sm font-bold px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'faq'
                  ? 'text-darkmoon-gold bg-darkmoon-gold/10'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
                }`}
              >
                {t('faqNav', language)}
              </button>
            </>
          ) : (
            <>
              <a
                href="/competition"
                className={`block w-full text-left text-sm font-bold px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'competition'
                  ? 'text-darkmoon-gold bg-darkmoon-gold/10'
                  : 'text-darkmoon-text-secondary hover:text-darkmoon-text-primary'
                }`}
              >
                {t('realtimeNav', language)}
              </a>
            </>
          )}

          {/* User info and logout for mobile when logged in */}
          {isLoggedIn && user && (
            <div className="mt-4 pt-4 border-t border-darkmoon-border">
              <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded bg-darkmoon-bg">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-darkmoon-gold text-black">
                  {user.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-darkmoon-text-muted">
                    {t('loggedInAs', language)}
                  </div>
                  <div className="text-sm text-darkmoon-text-primary">
                    {user.email}
                  </div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 rounded text-sm font-semibold transition-colors text-center bg-darkmoon-error/10 text-darkmoon-error"
                >
                  {t('exitLogin', language)}
                </button>
              )}
            </div>
          )}

          {!isLoggedIn &&
            currentPage !== 'login' &&
            currentPage !== 'register' && (
              <div className="space-y-2 mt-2">
                <a
                  href="/login"
                  className="block w-full px-4 py-2 rounded text-sm font-medium text-center transition-colors border border-darkmoon-border text-darkmoon-text-secondary hover:bg-darkmoon-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn', language)}
                </a>
                {registrationEnabled && (
                  <a
                    href="/register"
                    className="block w-full px-4 py-2 rounded font-semibold text-sm text-center transition-colors bg-darkmoon-gold text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('signUp', language)}
                  </a>
                )}
              </div>
            )}
        </div>
      </motion.div>
    </nav>
  )
}
