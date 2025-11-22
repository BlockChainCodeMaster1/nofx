import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { Sparkles, ArrowRight, Terminal, Cpu, Activity } from 'lucide-react'
import { t, Language } from '../../i18n/translations'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

interface HeroSectionProps {
  language: Language
}

export default function HeroSection({ language }: HeroSectionProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 50])
  const handControls = useAnimation()
  const { stars, daysOld, isLoading } = useGitHubStats('NoFxAiOS', 'nofx')

  // 动画数字 - 仅对 stars 添加动画
  const animatedStars = useCounterAnimation({
    start: 0,
    end: stars,
    duration: 2000,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
  }

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.15 } },
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
      {/* AI Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 175, 55, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-darkmoon-gold/10 via-transparent to-transparent blur-[100px]" />
      </div>
      
      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Text & CTA */}
          <motion.div
            className="space-y-8 relative z-10"
            style={{ opacity, scale, y }}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Status Badge */}
            <motion.div variants={fadeInUp}>
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-darkmoon-surface border border-darkmoon-gold/30 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                whileHover={{
                  scale: 1.02,
                  borderColor: '#D4AF37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-mono text-darkmoon-gold tracking-wide">
                  AI TRADING SYSTEM ONLINE
                </span>
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-2">
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold leading-tight text-white tracking-tight"
                variants={fadeInUp}
              >
                {t('heroTitle1', language)}
              </motion.h1>
              <motion.div 
                className="text-5xl lg:text-7xl font-bold leading-tight"
                variants={fadeInUp}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-darkmoon-gold via-[#F3CF55] to-[#B08D26] drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                  {t('heroTitle2', language)}
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              className="text-lg lg:text-xl leading-relaxed text-darkmoon-text-secondary max-w-xl font-light"
              variants={fadeInUp}
            >
              {t('heroDescription', language)}
            </motion.p>

            {/* Stats / GitHub Info */}
            <motion.div variants={fadeInUp} className="flex items-center gap-6 py-4">
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  {isLoading ? '...' : (animatedStars / 1000).toFixed(1) + 'k'}
                </div>
                <div className="text-xs text-darkmoon-text-muted uppercase tracking-wider">GitHub Stars</div>
              </div>
              <div className="w-px h-10 bg-darkmoon-border" />
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  {isLoading ? '...' : daysOld}
                </div>
                <div className="text-xs text-darkmoon-text-muted uppercase tracking-wider">Days Active</div>
              </div>
              <div className="w-px h-10 bg-darkmoon-border" />
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-white font-mono">24/7</div>
                <div className="text-xs text-darkmoon-text-muted uppercase tracking-wider">Auto Trading</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-2"
              variants={fadeInUp}
            >
              <motion.a
                href="https://github.com/tinkle-community/nofx"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] text-black font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Terminal className="w-5 h-5" />
                <span>{t('startWithCrypto', language).split(' ')[0] || 'Start Now'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="/competition"
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-darkmoon-surface border border-darkmoon-border text-white font-medium text-lg hover:border-darkmoon-gold/50 hover:bg-darkmoon-surface-light transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Activity className="w-5 h-5 text-darkmoon-gold" />
                <span>Live Demo</span>
              </motion.a>
            </motion.div>

            {/* Tech Stack Badges */}
            <motion.div 
              variants={fadeInUp}
              className="pt-8 flex items-center gap-4 text-sm text-darkmoon-text-muted"
            >
              <span>Powered by:</span>
              <div className="flex gap-3">
                <span className="px-2 py-1 rounded bg-darkmoon-surface-light border border-darkmoon-border flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> GPT-4
                </span>
                <span className="px-2 py-1 rounded bg-darkmoon-surface-light border border-darkmoon-border flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Claude 3.5
                </span>
                <span className="px-2 py-1 rounded bg-darkmoon-surface-light border border-darkmoon-border flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> DeepSeek
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Interactive Robot Hand */}
          <div
            className="relative w-full hidden lg:block"
            onMouseEnter={() => {
              handControls.start({
                y: [-10, 10, -10],
                rotate: [-2, 2, -2],
                scale: [1, 1.02, 1],
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              })
            }}
            onMouseLeave={() => {
              handControls.start({ y: 0, rotate: 0, scale: 1, transition: { duration: 0.5 } })
            }}
          >
            {/* Abstract Tech Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-darkmoon-gold/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-darkmoon-gold/20 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />
            
            {/* Main Image Layers */}
            <div className="relative z-10">
              <motion.img
                src="/images/hand-bg.png"
                alt="AI Interface"
                className="w-full relative z-0 opacity-80 mix-blend-screen"
                style={{ opacity, scale }}
                animate={{ 
                  filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"] 
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.img
                src="/images/hand.png"
                alt="Robot Hand"
                className="absolute top-0 left-0 w-full z-10 drop-shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                style={{ opacity }}
                animate={handControls}
                initial={{ y: 0 }}
              />
              
              {/* Floating Particles/Data points */}
              <motion.div 
                className="absolute top-20 right-20 w-3 h-3 bg-darkmoon-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-40 left-20 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                animate={{ y: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
