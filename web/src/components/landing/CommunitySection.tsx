import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { MessageSquare, Twitter } from 'lucide-react'

interface CardProps {
  quote: string
  authorName: string
  handle: string
  avatarUrl: string
  tweetUrl: string
  delay: number
}

function TestimonialCard({ quote, authorName, handle, tweetUrl, delay }: CardProps) {
  return (
    <motion.a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 rounded-xl bg-darkmoon-surface border border-darkmoon-border relative overflow-hidden group hover:border-darkmoon-gold/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <Twitter className="w-5 h-5 text-darkmoon-text-secondary group-hover:text-[#1DA1F2]" />
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-darkmoon-gold to-[#F3CF55] flex items-center justify-center text-black font-bold text-sm shadow-lg">
            {authorName.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-bold text-darkmoon-text-primary group-hover:text-darkmoon-gold transition-colors">
            {authorName}
          </div>
          <div className="text-xs text-darkmoon-text-muted">
            {handle}
          </div>
        </div>
      </div>

      <div className="relative">
        <MessageSquare className="absolute -top-2 -left-2 w-4 h-4 text-darkmoon-border opacity-20 transform -scale-x-100" />
        <p className="text-sm leading-relaxed text-darkmoon-text-secondary pl-4 border-l-2 border-darkmoon-border group-hover:border-darkmoon-gold/50 transition-colors">
          {quote}
        </p>
      </div>
    </motion.a>
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
        '前不久非常火的 AI 量化交易系统 NOF1，在 GitHub 上有人将其复刻并开源，这就是 DarkMoon 项目。基于 DeepSeek、Qwen 等大语言模型，打造的通用架构 AI 交易操作系统。',
      authorName: 'Michael Williams',
      handle: '@MichaelWil93725',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/MichaelWil93725/status/1984980920395604008',
      delay: 0,
    },
    {
      quote:
        '跑了一晚上 @nofx_official 开源的 AI 自动交易，太有意思了，就看 AI 在那一会开空一会开多，一顿操作，一晚上帮我赚了 6% 收益。',
      authorName: 'DIŸgöd',
      handle: '@DIYgod',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/DIYgod/status/1984442354515017923',
      delay: 0.1,
    },
    {
      quote:
        'Open-source DarkMoon revives the legendary Alpha Arena. Built on DeepSeek/Qwen AI, it trades live on Binance, Hyperliquid, and Aster DEX.',
      authorName: 'Kai',
      handle: '@hqmank',
      avatarUrl: '',
      tweetUrl: 'https://twitter.com/hqmank/status/1984227431994290340',
      delay: 0.15,
    },
  ]

  return (
    <AnimatedSection backgroundColor="transparent">
      <div className="max-w-7xl mx-auto py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Community Voices</h2>
          <p className="text-darkmoon-text-muted">See what traders are saying about DarkMoon</p>
        </motion.div>
        
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
