import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { Code, Cpu, Lock } from 'lucide-react'
import { t, Language } from '../../i18n/translations'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      className="p-8 border border-[#222] bg-[#0a0a0a] hover:bg-[#111] transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="mb-6 text-white">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-[#888] leading-relaxed">{description}</p>
    </motion.div>
  )
}

interface FeaturesSectionProps {
  language: Language
}

export default function FeaturesSection({ language }: FeaturesSectionProps) {
  return (
    <AnimatedSection id="features" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-white">
            {t('whyChooseNofx', language)}
          </h2>
          <p className="text-xl text-[#888] leading-relaxed">
            {t('openCommunityDriven', language)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Code className="w-8 h-8" />}
            title={t('openSourceSelfHosted', language)}
            description={t('openSourceDesc', language)}
            delay={0}
          />
          <FeatureCard
            icon={<Cpu className="w-8 h-8" />}
            title={t('multiAgentCompetition', language)}
            description={t('multiAgentDesc', language)}
            delay={0.1}
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8" />}
            title={t('secureReliableTrading', language)}
            description={t('secureDesc', language)}
            delay={0.2}
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
