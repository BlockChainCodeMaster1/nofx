import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { t, Language } from '../../i18n/translations'
import { useGitHubStats } from '../../hooks/useGitHubStats'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'

interface HeroSectionProps {
  language: Language
}

export default function HeroSection({ language }: HeroSectionProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const handControls = useAnimation()
  const { stars, daysOld, isLoading } = useGitHubStats('NoFxAiOS', 'nofx')

  // 动画数字 - 仅对 stars 添加动画
  const animatedStars = useCounterAnimation({
    start: 0,
    end: stars,
    duration: 2000,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
  }
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  return (
    <section className="relative pt-32 pb-20 px-4">
      {/* Hero Background Effect */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-darkmoon-gold/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8 relative z-10"
            style={{ opacity, scale }}
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2 bg-darkmoon-surface border border-darkmoon-gold/20 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  borderColor: '#D4AF37',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
                }}
              >
                <Sparkles className="w-4 h-4 text-darkmoon-gold" />
                <span className="text-sm font-semibold text-darkmoon-gold">
                  {isLoading ? (
                    t('githubStarsInDays', language)
                  ) : language === 'zh' ? (
                    <>
                      {daysOld} 天内{' '}
                      <span className="inline-block tabular-nums font-mono">
                        {(animatedStars / 1000).toFixed(1)}
                      </span>
                      K+ GitHub Stars
                    </>
                  ) : (
                    <>
                      <span className="inline-block tabular-nums font-mono">
                        {(animatedStars / 1000).toFixed(1)}
                      </span>
                      K+ GitHub Stars in {daysOld} days
                    </>
                  )}
                </span>
              </motion.div>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
              {t('heroTitle1', language)}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-darkmoon-gold to-[#F3CF55] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                {t('heroTitle2', language)}
              </span>
            </h1>

            <motion.p
              className="text-xl leading-relaxed text-darkmoon-text-secondary max-w-xl"
              variants={fadeInUp}
            >
              {t('heroDescription', language)}
            </motion.p>

            <div className="flex items-center gap-3 flex-wrap">
              <motion.a
                href="https://github.com/tinkle-community/nofx"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="shadow-lg shadow-black/50"
              >
                <img
                  src="https://img.shields.io/github/stars/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=0B0B10&labelColor=1E1E2A"
                  alt="GitHub Stars"
                  className="h-8 rounded"
                />
              </motion.a>
              <motion.a
                href="https://github.com/tinkle-community/nofx/network/members"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="shadow-lg shadow-black/50"
              >
                <img
                  src="https://img.shields.io/github/forks/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=0B0B10&labelColor=1E1E2A"
                  alt="GitHub Forks"
                  className="h-8 rounded"
                />
              </motion.a>
              <motion.a
                href="https://github.com/tinkle-community/nofx/graphs/contributors"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="shadow-lg shadow-black/50"
              >
                <img
                  src="https://img.shields.io/github/contributors/tinkle-community/nofx?style=for-the-badge&logo=github&logoColor=white&color=0B0B10&labelColor=1E1E2A"
                  alt="GitHub Contributors"
                  className="h-8 rounded"
                />
              </motion.a>
            </div>

            <motion.p
              className="text-xs pt-4 text-darkmoon-text-muted font-mono"
              variants={fadeInUp}
            >
              {t('poweredBy', language)}
            </motion.p>
          </motion.div>

          {/* Right Visual - Interactive Robot */}
          <div
            className="relative w-full cursor-pointer"
            onMouseEnter={() => {
              handControls.start({
                y: [-8, 8, -8],
                rotate: [-3, 3, -3],
                x: [-2, 2, -2],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.5, 1],
                },
              })
            }}
            onMouseLeave={() => {
              handControls.start({
                y: 0,
                rotate: 0,
                x: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeOut',
                },
              })
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-darkmoon-gold/20 blur-[100px] rounded-full opacity-30 pointer-events-none"></div>
            
            {/* Background Layer */}
            <motion.img
              src="/images/hand-bg.png"
              alt="NOFX Platform Background"
              className="w-full opacity-90 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              style={{ opacity, scale }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />

            {/* Hand Layer - Animated */}
            <motion.img
              src="/images/hand.png"
              alt="Robot Hand"
              className="absolute top-0 left-0 w-full drop-shadow-2xl"
              style={{ opacity }}
              animate={handControls}
              initial={{ y: 0, rotate: 0, x: 0 }}
              whileHover={{
                scale: 1.05,
                transition: { type: 'spring', stiffness: 400 },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
