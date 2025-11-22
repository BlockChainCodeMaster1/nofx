import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { t, Language } from '../../i18n/translations'
import { AlertTriangle, ChevronRight } from 'lucide-react'

function StepCard({ number, title, description, delay, isLast }: any) {
  return (
    <div className="relative pl-10 md:pl-0">
      {/* Connecting Line (Desktop) */}
      <div className="hidden md:block absolute left-[27px] top-[60px] bottom-[-20px] w-0.5 bg-darkmoon-border">
        {!isLast && (
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-darkmoon-gold to-transparent h-full origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.5 }}
          />
        )}
      </div>

      <motion.div
        className="flex flex-col md:flex-row gap-6 items-start group"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
      >
        {/* Number Badge */}
        <div className="flex-shrink-0 relative z-10">
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl bg-darkmoon-surface border-2 border-darkmoon-gold/50 text-darkmoon-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:bg-darkmoon-gold group-hover:text-black transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            {number}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 rounded-2xl bg-darkmoon-surface/30 border border-darkmoon-border hover:border-darkmoon-gold/30 hover:bg-darkmoon-surface/60 transition-all duration-300 relative group-hover:translate-x-2">
          <div className="absolute top-1/2 -left-2 w-4 h-4 bg-darkmoon-surface border-l border-b border-darkmoon-border transform rotate-45 group-hover:border-darkmoon-gold/30 transition-colors duration-300 hidden md:block" />
          
          <h3 className="text-xl font-bold mb-2 text-darkmoon-text-primary flex items-center gap-2">
            {title}
            <ChevronRight className="w-4 h-4 text-darkmoon-gold opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
          </h3>
          <p className="text-base leading-relaxed text-darkmoon-text-secondary">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

interface HowItWorksSectionProps {
  language: Language
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  const steps = [
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
  ]

  return (
    <AnimatedSection id="how-it-works" backgroundColor="transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            {t('howToStart', language)}
          </h2>
          <p className="text-lg text-darkmoon-text-secondary">
            {t('fourSimpleSteps', language)}
          </p>
        </motion.div>

        <div className="space-y-8 relative">
          {/* Vertical Line for Mobile */}
          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-darkmoon-border md:hidden" />
          
          {steps.map((step, index) => (
            <StepCard 
              key={step.number} 
              {...step} 
              delay={index * 0.1} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <motion.div
          className="mt-16 p-6 rounded-xl flex items-start gap-4 bg-red-900/10 border border-red-500/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(239, 68, 68, 0.5)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold mb-1 text-red-400 tracking-wide uppercase text-sm">
              {t('importantRiskWarning', language)}
            </div>
            <p className="text-sm text-red-200/70 leading-relaxed">
              {t('riskWarningText', language)}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
