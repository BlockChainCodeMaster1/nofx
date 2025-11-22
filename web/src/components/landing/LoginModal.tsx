import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { t, Language } from '../../i18n/translations'
import { useSystemConfig } from '../../hooks/useSystemConfig'

interface LoginModalProps {
  onClose: () => void
  language: Language
}

export default function LoginModal({ onClose, language }: LoginModalProps) {
  const { config: systemConfig } = useSystemConfig()
  const registrationEnabled = systemConfig?.registration_enabled !== false

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-md w-full rounded-2xl p-8 bg-darkmoon-surface border border-darkmoon-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-darkmoon-text-secondary hover:text-darkmoon-gold transition-colors"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        <h2 className="text-2xl font-bold mb-2 text-white">
          {t('accessNofxPlatform', language)}
        </h2>
        <p className="text-sm mb-8 text-darkmoon-text-secondary">
          {t('loginRegisterPrompt', language)}
        </p>
        <div className="space-y-4">
          <motion.button
            onClick={() => {
              window.history.pushState({}, '', '/login')
              window.dispatchEvent(new PopStateEvent('popstate'))
              onClose()
            }}
            className="block w-full px-6 py-3.5 rounded-lg font-bold text-center bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black shadow-lg shadow-darkmoon-gold/20"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t('signIn', language)}
          </motion.button>
          {registrationEnabled && (
            <motion.button
              onClick={() => {
                window.history.pushState({}, '', '/register')
                window.dispatchEvent(new PopStateEvent('popstate'))
                onClose()
              }}
              className="block w-full px-6 py-3.5 rounded-lg font-semibold text-center bg-transparent text-darkmoon-text-primary border border-darkmoon-gold/30 hover:bg-darkmoon-gold/10 hover:border-darkmoon-gold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('registerNewAccount', language)}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
