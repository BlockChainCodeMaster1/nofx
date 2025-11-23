import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'

interface TestimonialProps {
  quote: string
  author: string
  role: string
}

function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <div className="p-8 border-l border-[#222]">
      <p className="text-xl text-[#e1e1e1] mb-8 leading-relaxed font-light">"{quote}"</p>
      <div>
        <div className="font-bold text-white">{author}</div>
        <div className="text-[#666] text-sm">{role}</div>
      </div>
    </div>
  )
}

export default function CommunitySection() {
  return (
    <AnimatedSection backgroundColor="transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-white">
              Community Voices
            </h2>
            <p className="text-xl text-[#888] max-w-md">
              Join thousands of traders building the future of automated trading.
            </p>
          </div>
          
          <div className="space-y-12">
            <Testimonial 
              quote="Open-source DarkMoon revives the legendary Alpha Arena. Built on DeepSeek/Qwen AI, it trades live on Binance, Hyperliquid, and Aster DEX."
              author="Kai"
              role="@hqmank"
            />
            <Testimonial 
              quote="Based on DeepSeek, Qwen and other large language models, we built a general architecture AI trading operating system that completes the closed loop from decision making to trading to review."
              author="Michael Williams"
              role="@MichaelWil93725"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
