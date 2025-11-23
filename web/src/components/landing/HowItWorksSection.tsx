import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { t, Language } from '../../i18n/translations'

interface HowItWorksSectionProps {
  language: Language
}

export default function HowItWorksSection({ language }: HowItWorksSectionProps) {
  return (
    <AnimatedSection id="how-it-works" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-white">
            {t('howToStart', language)}
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-px bg-[#222] border border-[#222]">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="bg-[#050505] p-8 hover:bg-[#0a0a0a] transition-colors duration-300 group h-full">
              <div className="text-6xl font-bold text-[#222] mb-8 group-hover:text-white transition-colors duration-300">
                0{num}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">
                {t(`step${num}Title` as any, language)}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">
                {t(`step${num}Desc` as any, language)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
