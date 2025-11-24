import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Terminal } from 'lucide-react'
import HeaderBar from '../components/HeaderBar'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CommunitySection from '../components/landing/CommunitySection'
import AnimatedSection from '../components/landing/AnimatedSection'
import LoginModal from '../components/landing/LoginModal'
import FooterSection from '../components/landing/FooterSection'
import BackgroundEffects from '../components/landing/BackgroundEffects'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'

// Exchange logos for the ticker - simplified
const EXCHANGES = [
  { name: 'Binance', opacity: 0.8 },
  { name: 'Hyperliquid', opacity: 0.9 },
  { name: 'OKX', opacity: 0.7 },
  { name: 'Bybit', opacity: 0.7 },
  { name: 'Aster DEX', opacity: 0.9 },
  { name: 'Gate.io', opacity: 0.6 },
  { name: 'KuCoin', opacity: 0.6 },
]

export function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, logout } = useAuth()
  const { language, setLanguage } = useLanguage()
  const isLoggedIn = !!user

  return (
    <>
      <HeaderBar
        onLoginClick={() => setShowLoginModal(true)}
        isLoggedIn={isLoggedIn}
        isHomePage={true}
        language={language}
        onLanguageChange={setLanguage}
        user={user}
        onLogout={logout}
        onPageChange={(page) => {
          if (page === 'competition') {
            window.location.href = '/competition'
          } else if (page === 'traders') {
            window.location.href = '/traders'
          } else if (page === 'trader') {
            window.location.href = '/dashboard'
          }
        }}
      />
      
      <div className="min-h-screen bg-[#050505] text-[#e1e1e1] font-sans selection:bg-[#f2f2f2] selection:text-black overflow-x-hidden">
        <BackgroundEffects />

        <div className="relative z-10 flex flex-col">
            <HeroSection language={language} />
            
            {/* Exchange Ticker */}
            <div className="w-full border-y border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden py-4">
              <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
                <div className="flex-1 overflow-hidden relative mask-linear-fade">
                  <motion.div 
                    className="flex items-center gap-16 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  >
                    {[...EXCHANGES, ...EXCHANGES, ...EXCHANGES, ...EXCHANGES].map((ex, i) => (
                      <span key={i} className="text-xl font-bold text-[#666] hover:text-white transition-colors cursor-default tracking-tight">
                        {ex.name}
                      </span>
                    ))}
                  </motion.div>
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="space-y-32 py-32">
              <AboutSection language={language} />
              
              {/* Stats Strip */}
              <div className="w-full py-24 border-y border-[#222] bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                  {[
                    { label: 'Trading Volume', value: '$10M+' },
                    { label: 'Uptime', value: '99.9%' },
                    { label: 'Latency', value: '<50ms' },
                    { label: 'Open Source', value: '100%' },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-start">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className="text-sm text-[#666] font-medium uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <FeaturesSection language={language} />
              <HowItWorksSection language={language} />
              <CommunitySection />

              {/* CTA Section */}
              <AnimatedSection backgroundColor="transparent">
                <div className="max-w-5xl mx-auto px-4">
                  <div className="relative rounded-[2.5rem] p-12 md:p-24 overflow-hidden bg-[#0a0a0a] border border-[#222] text-center">
                      {/* Subtle Glow */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
                      
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="relative z-10"
                      >
                          <h2 className="text-5xl md:text-8xl font-bold mb-8 text-white tracking-tighter leading-[0.9]">
                              {t('readyToDefine', language)}
                          </h2>
                          <p className="text-xl md:text-2xl text-[#888] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                              {t('startWithCrypto', language)}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                              <motion.button
                                  onClick={() => setShowLoginModal(true)}
                                  className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg bg-white text-black hover:bg-[#f2f2f2] transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                              >
                                  {t('getStartedNow', language)}
                                  <ArrowRight className="w-5 h-5" />
                              </motion.button>
                              <motion.a
                                  href="https://github.com/tinkle-community/nofx"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg bg-[#1a1a1a] text-white hover:bg-[#222] transition-all"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                              >
                                  <Terminal className="w-5 h-5" />
                                  {t('viewSourceCode', language)}
                              </motion.a>
                          </div>
                      </motion.div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {showLoginModal && (
            <LoginModal
                onClose={() => setShowLoginModal(false)}
                language={language}
            />
            )}
            <FooterSection language={language} />
        </div>
      </div>
    </>
  )
}
