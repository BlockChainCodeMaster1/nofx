import { motion } from 'framer-motion'
import { Shield, Target } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import Typewriter from '../Typewriter'
import { t, Language } from '../../i18n/translations'

interface AboutSectionProps {
  language: Language
}

export default function AboutSection({ language }: AboutSectionProps) {
  return (
    <AnimatedSection id="about" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkmoon-surface border border-darkmoon-gold/20"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4 text-darkmoon-gold" />
              <span className="text-sm font-semibold text-darkmoon-gold">
                {t('aboutNofx', language)}
              </span>
            </motion.div>

            <h2 className="text-4xl font-bold text-darkmoon-text-primary">
              {t('whatIsNofx', language)}
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-darkmoon-text-secondary">
                <p>
                {t('nofxNotAnotherBot', language)}{' '}
                {t('nofxDescription1', language)}{' '}
                {t('nofxDescription2', language)}
                </p>
                <p>
                {t('nofxDescription3', language)}{' '}
                {t('nofxDescription4', language)}{' '}
                {t('nofxDescription5', language)}
                </p>
            </div>

            <motion.div
              className="flex items-center gap-4 pt-4 p-4 rounded-xl hover:bg-darkmoon-surface/50 transition-colors border border-transparent hover:border-darkmoon-border"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-darkmoon-gold/10">
                <Shield className="w-6 h-6 text-darkmoon-gold" />
              </div>
              <div>
                <div className="font-semibold text-darkmoon-text-primary mb-1">
                  {t('youFullControl', language)}
                </div>
                <div className="text-sm text-darkmoon-text-muted">
                  {t('fullControlDesc', language)}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-darkmoon-gold to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl p-8 bg-darkmoon-surface border border-darkmoon-border shadow-2xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
              </div>
              <Typewriter
                lines={[
                  '$ git clone https://github.com/tinkle-community/nofx.git',
                  '$ cd nofx',
                  '$ chmod +x start.sh',
                  '$ ./start.sh start --build',
                  t('startupMessages1', language),
                  t('startupMessages2', language),
                  t('startupMessages3', language),
                ]}
                typingSpeed={70}
                lineDelay={900}
                className="text-sm font-mono"
                style={{
                  color: '#10B981',
                  textShadow: '0 0 5px rgba(16, 185, 129, 0.3)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
