import * as React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface CryptoFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  className?: string
  delay?: number
}

export const CryptoFeatureCard = React.forwardRef<
  HTMLDivElement,
  CryptoFeatureCardProps
>(({ icon, title, description, features, className, delay = 0 }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden border-2 transition-all duration-300 rounded-xl',
          'bg-gradient-to-br from-[#000000] to-[#0A0A0A]',
          'border-[#1A1A1A] hover:border-darkmoon-gold/50',
          isHovered && 'shadow-[0_0_20px_rgba(240,185,11,0.2)]',
          className
        )}
      >
        {/* Animated glow border effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-darkmoon-gold/20 to-transparent animate-[shimmer_2s_infinite]" />
        </motion.div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_#F0B90B_1px,_transparent_0)] bg-[length:32px_32px]"
          />
        </div>

        <div className="relative z-10 p-8 flex flex-col h-full">
          {/* Icon container */}
          <motion.div
            className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-darkmoon-gold/20 to-darkmoon-gold/5 border border-darkmoon-gold/30"
            animate={{
              scale: isHovered ? 1.1 : 1,
              boxShadow: isHovered
                ? '0 0 20px rgba(240, 185, 11, 0.4)'
                : '0 0 0px rgba(240, 185, 11, 0)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-darkmoon-gold">{icon}</div>
          </motion.div>

          {/* Title */}
          <h3
            className="text-2xl font-bold mb-3 text-darkmoon-text-primary"
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="mb-6 flex-grow leading-relaxed text-darkmoon-text-secondary"
          >
            {description}
          </p>

          {/* Features list */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center bg-darkmoon-gold/20"
                  >
                    <Check
                      className="w-3 h-3 text-darkmoon-gold"
                    />
                  </div>
                </div>
                <span
                  className="text-sm text-darkmoon-text-primary"
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

CryptoFeatureCard.displayName = 'CryptoFeatureCard'
