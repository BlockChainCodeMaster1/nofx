import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { t, Language } from '../../i18n/translations'

interface AboutSectionProps {
  language: Language
}

export default function AboutSection({ language }: AboutSectionProps) {
  return (
    <AnimatedSection id="about" backgroundColor="transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-white">
              {t('whatIsNofx', language)}
            </h2>
            <div className="space-y-8 text-xl text-[#888] leading-relaxed font-light">
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
          </motion.div>

          <motion.div
            className="bg-[#111] border border-[#222] p-8 font-mono text-sm overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-2 mb-6 border-b border-[#222] pb-4">
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
              <div className="w-3 h-3 rounded-full bg-[#333]" />
            </div>
            <div className="space-y-2 text-[#00ff00]">
              <p>$ git clone https://github.com/tinkle-community/nofx.git</p>
              <p className="text-[#666]">Cloning into 'nofx'...</p>
              <p>$ cd nofx</p>
              <p>$ ./start.sh</p>
              <p className="text-[#666]">[+] System initialized</p>
              <p className="text-[#666]">[+] AI agents connected</p>
              <p className="text-[#666]">[+] Trading engine ready</p>
              <p className="animate-pulse">_</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  )
}
