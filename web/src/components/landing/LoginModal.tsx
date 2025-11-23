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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-md w-full p-12 bg-[#0a0a0a] border border-[#222]"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#666] hover:text-white transition-colors"
          whileHover={{ rotate: 90 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        
        <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">
          {t('accessNofxPlatform', language)}
        </h2>
        <p className="text-[#888] mb-12 font-light">
          {t('loginRegisterPrompt', language)}
        </p>
        
        <div className="space-y-4">
          <motion.button
            onClick={() => {
              window.history.pushState({}, '', '/login')
              window.dispatchEvent(new PopStateEvent('popstate'))
              onClose()
            }}
            className="block w-full px-8 py-4 font-bold text-center bg-white text-black hover:bg-[#f2f2f2] transition-all"
            whileHover={{ scale: 1.02 }}
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
              className="block w-full px-8 py-4 font-bold text-center bg-[#1a1a1a] text-white hover:bg-[#222] transition-all"
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
