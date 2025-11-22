import { motion } from 'framer-motion'
import { Shield, Target, Terminal } from 'lucide-react'
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-darkmoon-surface border border-darkmoon-gold/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4 text-darkmoon-gold" />
              <span className="text-sm font-semibold text-darkmoon-gold tracking-wide">
                {t('aboutNofx', language).toUpperCase()}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t('whatIsNofx', language)}
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-darkmoon-text-secondary font-light">
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
              className="flex items-center gap-4 p-5 rounded-2xl bg-darkmoon-surface/50 border border-darkmoon-border hover:border-darkmoon-gold/30 hover:bg-darkmoon-surface transition-all duration-300 group"
              whileHover={{ x: 5 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-darkmoon-gold/10 group-hover:bg-darkmoon-gold/20 transition-colors">
                <Shield className="w-6 h-6 text-darkmoon-gold" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1 group-hover:text-darkmoon-gold transition-colors">
                  {t('youFullControl', language)}
                </div>
                <div className="text-sm text-darkmoon-text-muted group-hover:text-darkmoon-text-secondary transition-colors">
                  {t('fullControlDesc', language)}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative group perspective-1000">
            {/* Glow Effect behind terminal */}
            <div className="absolute -inset-2 bg-gradient-to-r from-darkmoon-gold/20 to-blue-600/20 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
            
            {/* Terminal Window */}
            <div className="relative rounded-xl bg-[#0d1117] border border-[#30363d] shadow-2xl overflow-hidden transform transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <Terminal className="w-3 h-3" />
                  bash — 80x24
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm h-[400px] overflow-hidden relative">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20"></div>
                
                <Typewriter
                  lines={[
                    '$ git clone https://github.com/tinkle-community/nofx.git',
                    'Cloning into \'nofx\'...',
                    '$ cd nofx',
                    '$ chmod +x start.sh',
                    '$ ./start.sh start --build',
                    '[+] Building Docker containers...',
                    '[+] Starting NoFx services...',
                    t('startupMessages1', language),
                    t('startupMessages2', language),
                    t('startupMessages3', language),
                    '----------------------------------------',
                    'SYSTEM READY. AI AGENTS INITIALIZED.',
                    'DarkMoon Protocol v2.0 Online...',
                    '$ _'
                  ]}
                  typingSpeed={50}
                  lineDelay={800}
                  className="relative z-0"
                  style={{
                    color: '#00ff00', // Matrix Green
                    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
