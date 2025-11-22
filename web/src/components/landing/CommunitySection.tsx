import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

interface CardProps {
  quote: string
  authorName: string
  handle: string
  avatarUrl: string
  tweetUrl: string
  delay: number
}

function TestimonialCard({ quote, authorName, delay }: CardProps) {
  return (
    <motion.div
      className="p-8 rounded-2xl bg-darkmoon-surface border border-darkmoon-border shadow-lg relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-darkmoon-gold/5 rounded-bl-full -mr-4 -mt-4 group-hover:bg-darkmoon-gold/10 transition-colors" />
      
      <p className="text-lg mb-6 text-darkmoon-text-primary leading-relaxed relative z-10">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-darkmoon-gold to-[#F3CF55] flex items-center justify-center text-black font-bold text-sm">
            {authorName.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-darkmoon-text-secondary group-hover:text-darkmoon-gold transition-colors">
          {authorName}
        </span>
      </div>
    </motion.div>
  )
}

export default function CommunitySection() {
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  }

  // 推特内容整合
  const items: CardProps[] = [
    {
      quote:
        '前不久非常火的 AI 量化交易系统 NOF1，在 GitHub 上有人将其复刻并开源，这就是 DarkMoon 项目。基于 DeepSeek、Qwen 等大语言模型，打造的通用架构 AI 交易操作系统，完成了从决策、到交易、再到复盘的闭环。GitHub: https://github.com/NoFxAiOS/nofx',
      authorName: 'Michael Williams',
      handle: '@MichaelWil93725',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/MichaelWil93725/status/1984980920395604008',
      delay: 0,
    },
    {
      quote:
        '跑了一晚上 @nofx_official 开源的 AI 自动交易，太有意思了，就看 AI 在那一会开空一会开多，一顿操作，虽然看不懂为什么，但是一晚上帮我赚了 6% 收益',
      authorName: 'DIŸgöd',
      handle: '@DIYgod',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/DIYgod/status/1984442354515017923',
      delay: 0.1,
    },
    {
      quote:
        'Open-source DarkMoon revives the legendary Alpha Arena, an AI-powered crypto futures battleground. Built on DeepSeek/Qwen AI, it trades live on Binance, Hyperliquid, and Aster DEX, featuring multi-AI battles and self-learning bots',
      authorName: 'Kai',
      handle: '@hqmank',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/hqmank/status/1984227431994290340',
      delay: 0.15,
    },
  ]

  return (
    <AnimatedSection backgroundColor="transparent">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-darkmoon-text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            Community Voices
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {items.map((item, idx) => (
            <TestimonialCard key={idx} {...item} />
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}
