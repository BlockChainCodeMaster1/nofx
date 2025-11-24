import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Terminal, Play } from 'lucide-react'
import { t, Language } from '../../i18n/translations'
import { useGitHubStats } from '../../hooks/useGitHubStats'

interface HeroSectionProps {
  language: Language
}

export default function HeroSection({ language }: HeroSectionProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const { stars } = useGitHubStats('NoFxAiOS', 'nofx')

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-5xl"
        >
          {/* Status / Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333]"
          >
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="text-sm font-mono text-[#888] tracking-wide">AI TRADING PROTOCOL V2.0</span>
          </motion.div>

          {/* Main Title */}
          <div className="space-y-2 mb-10">
            <motion.h1 
              className="text-6xl md:text-[7rem] font-bold leading-[0.9] tracking-tighter text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {t('heroTitle1', language)}
            </motion.h1>
            <motion.h1 
              className="text-6xl md:text-[7rem] font-bold leading-[0.9] tracking-tighter text-[#444]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('heroTitle2', language)}
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-[#888] max-w-2xl font-light leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('heroDescription', language)}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="https://github.com/tinkle-community/nofx"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-[#f2f2f2] transition-all"
            >
              <span>Start Trading</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/competition"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a1a1a] text-white font-medium text-lg hover:bg-[#222] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Demo</span>
            </a>

            {stars > 0 && (
              <div className="ml-4 text-[#666] font-mono text-sm">
                { (stars / 1000).toFixed(1) }k stars on GitHub
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Minimalist Graphic Element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-[80%] opacity-10 pointer-events-none hidden lg:block">
        <div className="w-full h-full border-l border-[#333] relative">
          <div className="absolute top-[20%] left-0 w-32 h-[1px] bg-[#333]" />
          <div className="absolute top-[40%] left-0 w-64 h-[1px] bg-[#333]" />
          <div className="absolute top-[60%] left-0 w-48 h-[1px] bg-[#333]" />
          <div className="absolute top-[80%] left-0 w-32 h-[1px] bg-[#333]" />
        </div>
      </div>
    </section>
  )
}
