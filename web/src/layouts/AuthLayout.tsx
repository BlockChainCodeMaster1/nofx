import { ReactNode } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { useLanguage } from '../contexts/LanguageContext'

interface AuthLayoutProps {
  children?: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-darkmoon-bg text-darkmoon-text-primary relative overflow-hidden font-sans selection:bg-darkmoon-gold selection:text-black">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-darkmoon-gold opacity-[0.02] blur-[100px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600 opacity-[0.02] blur-[80px]" />
        </div>

      {/* Simple Header with Logo and Language Selector */}
      <nav className="fixed top-0 w-full z-50 bg-darkmoon-bg/80 backdrop-blur-md border-b border-darkmoon-border">
        <Container className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <img src="/icons/nofx.svg" alt="DarkMoon Logo" className="w-8 h-8 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkmoon-gold to-[#F3CF55]">
              DarkMoon
            </span>
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1.5 rounded text-sm font-medium transition-all border border-darkmoon-border bg-darkmoon-surface hover:border-darkmoon-gold hover:text-darkmoon-gold text-darkmoon-text-secondary"
            >
              {language === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        </Container>
      </nav>

      {/* Content with top padding to avoid overlap with fixed header */}
      <div className="pt-24 relative z-10">{children || <Outlet />}</div>
    </div>
  )
}
