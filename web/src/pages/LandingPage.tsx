import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Terminal } from 'lucide-react'
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
        {/* Enhanced Background */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#030304]">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-darkmoon-bg to-darkmoon-bg opacity-60"></div>
           <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10">
            <HeroSection language={language} />
            
            {/* Spacer for visual breathing room */}
            <div className="h-20"></div>
            
            <AboutSection language={language} />
            <FeaturesSection language={language} />
            <HowItWorksSection language={language} />
            <CommunitySection />

            {/* Enhanced CTA Section */}
            <AnimatedSection backgroundColor="transparent">
              <div className="max-w-5xl mx-auto text-center py-24 relative">
                {/* Decorative glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-darkmoon-gold/5 rounded-full blur-[120px] -z-10"></div>
                
                <motion.h2
                  className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {t('readyToDefine', language)}
                </motion.h2>
                <motion.p
                  className="text-xl md:text-2xl mb-12 text-darkmoon-text-secondary max-w-3xl mx-auto font-light leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  {t('startWithCrypto', language)}
                </motion.p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <motion.button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center justify-center gap-3 px-12 py-5 rounded-xl font-bold text-lg bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
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
                    className="flex items-center justify-center gap-3 px-12 py-5 rounded-xl font-bold text-lg bg-darkmoon-surface border border-darkmoon-border text-white hover:border-darkmoon-gold/50 hover:bg-darkmoon-surface-light transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Terminal className="w-5 h-5 text-darkmoon-text-secondary" />
                    {t('viewSourceCode', language)}
                  </motion.a>
                </div>
              </div>
            </AnimatedSection>

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
