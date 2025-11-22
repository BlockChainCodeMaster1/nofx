import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { CryptoFeatureCard } from '../CryptoFeatureCard'
import { Code, Cpu, Lock, Rocket } from 'lucide-react'
import { t, Language } from '../../i18n/translations'

interface FeaturesSectionProps {
  language: Language
}

export default function FeaturesSection({ language }: FeaturesSectionProps) {
  return (
    <AnimatedSection id="features" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-darkmoon-surface border border-darkmoon-gold/20"
            whileHover={{ scale: 1.05 }}
          >
            <Rocket className="w-4 h-4 text-darkmoon-gold" />
            <span className="text-sm font-semibold text-darkmoon-gold">
              {t('coreFeatures', language)}
            </span>
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 text-darkmoon-text-primary">
            {t('whyChooseNofx', language)}
          </h2>
          <p className="text-lg text-darkmoon-text-secondary">
            {t('openCommunityDriven', language)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <CryptoFeatureCard
            icon={<Code className="w-8 h-8 text-darkmoon-gold" />}
            title={t('openSourceSelfHosted', language)}
            description={t('openSourceDesc', language)}
            features={[
              t('openSourceFeatures1', language),
              t('openSourceFeatures2', language),
              t('openSourceFeatures3', language),
              t('openSourceFeatures4', language),
            ]}
            delay={0}
          />
          <CryptoFeatureCard
            icon={<Cpu className="w-8 h-8 text-darkmoon-gold" />}
            title={t('multiAgentCompetition', language)}
            description={t('multiAgentDesc', language)}
            features={[
              t('multiAgentFeatures1', language),
              t('multiAgentFeatures2', language),
              t('multiAgentFeatures3', language),
              t('multiAgentFeatures4', language),
            ]}
            delay={0.1}
          />
          <CryptoFeatureCard
            icon={<Lock className="w-8 h-8 text-darkmoon-gold" />}
            title={t('secureReliableTrading', language)}
            description={t('secureDesc', language)}
            features={[
              t('secureFeatures1', language),
              t('secureFeatures2', language),
              t('secureFeatures3', language),
              t('secureFeatures4', language),
            ]}
            delay={0.2}
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
