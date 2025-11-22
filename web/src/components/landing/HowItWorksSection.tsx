import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { t, Language } from '../../i18n/translations'

function StepCard({ number, title, description, delay }: any) {
  return (
    <motion.div
      className="flex gap-6 items-start p-6 rounded-xl hover:bg-darkmoon-surface/30 transition-colors border border-transparent hover:border-darkmoon-border"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ x: 10 }}
    >
      <motion.div
        className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl bg-gradient-to-br from-darkmoon-gold to-[#F3CF55] text-black shadow-lg shadow-darkmoon-gold/20"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {number}
      </motion.div>
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-darkmoon-text-primary">
          {title}
        </h3>
        <p className="text-lg leading-relaxed text-darkmoon-text-secondary">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

interface HowItWorksSectionProps {
  language: Language
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  return (
    <AnimatedSection id="how-it-works" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-darkmoon-text-primary">
            {t('howToStart', language)}
          </h2>
          <p className="text-lg text-darkmoon-text-secondary">
            {t('fourSimpleSteps', language)}
          </p>
        </motion.div>

        <div className="space-y-4 bg-darkmoon-surface/20 p-8 rounded-2xl border border-darkmoon-border backdrop-blur-sm">
          {[
            {
              number: 1,
              title: t('step1Title', language),
              description: t('step1Desc', language),
            },
            {
              number: 2,
              title: t('step2Title', language),
              description: t('step2Desc', language),
            },
            {
              number: 3,
              title: t('step3Title', language),
              description: t('step3Desc', language),
            },
            {
              number: 4,
              title: t('step4Title', language),
              description: t('step4Desc', language),
            },
          ].map((step, index) => (
            <StepCard key={step.number} {...step} delay={index * 0.1} />
          ))}
        </div>

        <motion.div
          className="mt-12 p-6 rounded-xl flex items-start gap-4 bg-red-900/10 border border-red-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500/20 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
          </div>
          <div>
            <div className="font-semibold mb-2 text-red-400">
              {t('importantRiskWarning', language)}
            </div>
            <p className="text-sm text-red-200/70">
              {t('riskWarningText', language)}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
