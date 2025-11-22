import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
        {/* Background Gradient */}
        <div className="fixed inset-0 z-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] via-darkmoon-bg to-darkmoon-bg opacity-60"></div>
        </div>

        <div className="relative z-10">
            <HeroSection language={language} />
            <AboutSection language={language} />
            <FeaturesSection language={language} />
            <HowItWorksSection language={language} />
            <CommunitySection />

            {/* CTA */}
            <AnimatedSection backgroundColor="transparent">
            <div className="max-w-4xl mx-auto text-center py-20">
                <motion.h2
                className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                >
                {t('readyToDefine', language)}
                </motion.h2>
                <motion.p
                className="text-xl mb-12 text-darkmoon-text-secondary max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                >
                {t('startWithCrypto', language)}
                </motion.p>
                <div className="flex flex-wrap justify-center gap-6">
                <motion.button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t('getStartedNow', language)}
                    <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    >
                    <ArrowRight className="w-5 h-5" />
                    </motion.div>
                </motion.button>
                <motion.a
                    href="https://github.com/tinkle-community/nofx/tree/dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg bg-transparent border border-darkmoon-border text-darkmoon-text-primary hover:border-darkmoon-gold hover:text-darkmoon-gold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
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
