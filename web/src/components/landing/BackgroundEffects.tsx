import { useEffect, useRef } from 'react'

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = width / 2
    let targetMouseY = height / 2
    let time = 0

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // Mouse handler
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    const animate = () => {
      // Trails effect: clear with low opacity
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'
      ctx.fillRect(0, 0, width, height)

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      // Configuration
      const spiralArms = 3
      const particlesPerArm = 100
      const maxRadius = Math.max(width, height) * 0.8

      time += 0.02

      ctx.save()
      ctx.translate(mouseX, mouseY)
      
      // Draw Spiral
      for (let i = 0; i < spiralArms; i++) {
        const armAngleOffset = (Math.PI * 2 * i) / spiralArms
        
        ctx.beginPath()
        for (let j = 0; j < particlesPerArm; j++) {
          const progress = j / particlesPerArm
          const radius = progress * maxRadius
          
          // Base spiral angle
          let angle = progress * Math.PI * 10 + time * 0.5 + armAngleOffset
          
          // Ripple effect (Sine wave modulation on radius/angle)
          // The frequency and amplitude change with time and mouse speed/position implicitly
          const ripple = Math.sin(progress * 20 - time * 4) * 20
          
          // Mouse interaction: distort based on distance from center (which is mouse)
          // Actually, we are already centered on mouse. Let's make the ripple more intense
          // if mouse is moving (we could track velocity), but simpler is just continuous ripple.
          
          const x = (radius + ripple) * Math.cos(angle)
          const y = (radius + ripple) * Math.sin(angle)
          
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        // Colorful Stroke
        // Color shifts based on arm index, time, and progress along the arm
        const hue = (time * 50 + i * 100) % 360
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.5)`
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Add a second layer for glow/water effect
        ctx.strokeStyle = `hsla(${hue + 180}, 80%, 60%, 0.2)`
        ctx.lineWidth = 10
        ctx.stroke()
      }
      
      ctx.restore()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none bg-[#050505]"
    />
  )
}
