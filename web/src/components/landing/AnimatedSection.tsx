import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function AnimatedSection({
  children,
  id,
  backgroundColor = 'transparent',
}: {
  children: React.ReactNode
  id?: string
  backgroundColor?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      id={id}
      ref={ref}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: backgroundColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  )
}
