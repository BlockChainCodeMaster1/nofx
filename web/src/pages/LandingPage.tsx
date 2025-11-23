import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Terminal, Globe, Shield } from 'lucide-react'
import HeaderBar from '../components/HeaderBar'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import CommunitySection from '../components/landing/CommunitySection'
import AnimatedSection from '../components/landing/AnimatedSection'
import LoginModal from '../components/landing/LoginModal'
import FooterSection from '../components/landing/FooterSection'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../i18n/translations'

// Exchange logos for the ticker
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
      
      <div className="min-h-screen bg-darkmoon-bg text-darkmoon-text-primary font-sans selection:bg-darkmoon-gold selection:text-black overflow-x-hidden">
        {/* Global Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
           {/* Deep radial gradient for atmosphere */}
           <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_0%,_#151520_0%,_#030304_60%)]"></div>
           
           {/* Subtle Grid Overlay */}
           <div 
             className="absolute inset-0 opacity-[0.03]" 
             style={{
               backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}
           ></div>
        </div>

        <div className="relative z-10 flex flex-col gap-0">
            <HeroSection language={language} />
            
            {/* Supported Exchanges Ticker */}
            <div className="w-full border-y border-darkmoon-border/30 bg-darkmoon-surface/20 backdrop-blur-sm overflow-hidden py-6">
              <div className="max-w-7xl mx-auto px-4 flex items-center gap-8">
                <div className="text-xs font-mono text-darkmoon-text-muted uppercase tracking-widest whitespace-nowrap hidden md:block">
                  Trusted Connectivity
                </div>
                <div className="flex-1 overflow-hidden relative mask-linear-fade">
                  <motion.div 
                    className="flex items-center gap-12 whitespace-nowrap"
                    animate={{ x: [0, -500] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  >
                    {[...EXCHANGES, ...EXCHANGES, ...EXCHANGES].map((ex, i) => (
                      <span key={i} className="text-lg font-bold text-darkmoon-text-secondary hover:text-darkmoon-text-primary transition-colors cursor-default" style={{ opacity: ex.opacity }}>
                        {ex.name}
                      </span>
                    ))}
                  </motion.div>
                  {/* Fade edges */}
                  <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-darkmoon-bg/0 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-darkmoon-bg/0 to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="space-y-24 py-24">
              <AboutSection language={language} />
              <FeaturesSection language={language} />
              
              {/* Quick Stats / Trust Strip */}
              <div className="w-full py-20 bg-gradient-to-r from-darkmoon-surface/50 via-darkmoon-surface/80 to-darkmoon-surface/50 border-y border-darkmoon-border/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">$10M+</div>
                    <div className="text-sm text-darkmoon-text-muted uppercase tracking-wider">Trading Volume</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-darkmoon-gold font-mono mb-2">24/7</div>
                    <div className="text-sm text-darkmoon-text-muted uppercase tracking-wider">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-2">0ms</div>
                    <div className="text-sm text-darkmoon-text-muted uppercase tracking-wider">Fees Added</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-emerald-500 font-mono mb-2">100%</div>
                    <div className="text-sm text-darkmoon-text-muted uppercase tracking-wider">Open Source</div>
                  </div>
                </div>
              </div>

              <HowItWorksSection language={language} />
              <CommunitySection />

              {/* Redesigned CTA Section */}
              <AnimatedSection backgroundColor="transparent">
                <div className="max-w-6xl mx-auto px-4">
                  <div className="relative rounded-[2rem] p-12 md:p-24 overflow-hidden border border-darkmoon-border bg-darkmoon-surface/30 backdrop-blur-xl text-center group">
                      {/* Dynamic Background */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-darkmoon-gold/10 rounded-full blur-[120px] opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-darkmoon-bg to-transparent"></div>
                      </div>
                      
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="relative z-10"
                      >
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkmoon-surface border border-darkmoon-gold/30 mb-8">
                            <Zap className="w-4 h-4 text-darkmoon-gold fill-darkmoon-gold" />
                            <span className="text-sm font-bold text-darkmoon-gold tracking-wide uppercase">
                              Ready to deploy
                            </span>
                          </div>

                          <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                              {t('readyToDefine', language)}
                          </h2>
                          <p className="text-xl text-darkmoon-text-secondary mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                              {t('startWithCrypto', language)}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                              <motion.button
                                  onClick={() => setShowLoginModal(true)}
                                  className="flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
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
                                  className="flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg bg-darkmoon-surface border border-darkmoon-border text-white hover:border-darkmoon-gold hover:text-darkmoon-gold transition-all"
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
