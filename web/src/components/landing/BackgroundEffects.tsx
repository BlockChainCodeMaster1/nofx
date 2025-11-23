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
    
    // Mouse state for interaction
    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = width / 2
    let targetMouseY = height / 2

    // Diamond 3D Geometry
    // Simple diamond shape approximation
    const diamondVertices: {x: number, y: number, z: number}[] = []
    const segments = 8
    
    // 1. Bottom tip (Culet)
    diamondVertices.push({ x: 0, y: 1.5, z: 0 }) // Index 0
    
    // 2. Middle ring (Girdle)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      diamondVertices.push({
        x: Math.cos(theta) * 1,
        y: 0,
        z: Math.sin(theta) * 1
      })
    } // Indices 1 to 8
    
    // 3. Top table (Table) - smaller ring
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      diamondVertices.push({
        x: Math.cos(theta) * 0.6,
        y: -0.4,
        z: Math.sin(theta) * 0.6
      })
    } // Indices 9 to 16

    // 4. Center top (for simple variation, or flat top)
    // Let's make it a flat top, so we connect the table vertices
    
    // Edges definition (pairs of vertex indices)
    const edges: [number, number][] = []
    
    // Connect Bottom tip to Middle ring
    for (let i = 0; i < segments; i++) {
      edges.push([0, 1 + i])
    }
    
    // Connect Middle ring vertices to each other
    for (let i = 0; i < segments; i++) {
      edges.push([1 + i, 1 + (i + 1) % segments])
    }
    
    // Connect Middle ring to Top ring
    for (let i = 0; i < segments; i++) {
      edges.push([1 + i, 9 + i])
      // Also slight diagonal for triangulation style
      edges.push([1 + i, 9 + (i + 1) % segments])
    }
    
    // Connect Top ring vertices to each other
    for (let i = 0; i < segments; i++) {
      edges.push([9 + i, 9 + (i + 1) % segments])
    }
    
    // Connect Top ring to center (optional, making it look closed)
    // Let's create a center point for the top face to close it visually
    diamondVertices.push({ x: 0, y: -0.4, z: 0 }) // Index 17 (Top Center)
    for (let i = 0; i < segments; i++) {
      edges.push([9 + i, 17])
    }

    let time = 0

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Helper: 3D Rotation
    const rotateX = (p: {x:number, y:number, z:number}, angle: number) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos }
    }
    
    const rotateY = (p: {x:number, y:number, z:number}, angle: number) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos }
    }

    // Helper: 3D Projection
    const project = (p: {x:number, y:number, z:number}) => {
      const fov = 800
      const distance = 3 // Camera distance
      const scale = 150 // Size of diamond
      
      const factor = fov / (fov + (p.z + distance) * 100)
      
      return {
        x: p.x * scale * factor + width / 2,
        y: p.y * scale * factor + height / 2
      }
    }

    const animate = () => {
      // 1. Draw Background (Clear & Waves)
      // Clear with dark color
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)
      
      time += 0.01
      
      // Draw smooth waves
      const waveCount = 5
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        const hue = (time * 10 + i * 50) % 360
        ctx.strokeStyle = `hsla(${hue}, 50%, 50%, 0.15)`
        ctx.lineWidth = 2
        
        for (let x = 0; x <= width; x += 10) {
          // Sine wave combination
          const y = height / 2 + 
            Math.sin(x * 0.003 + time + i) * 100 + 
            Math.sin(x * 0.01 - time * 0.5) * 50
            
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // 2. Draw Overlay Mask (Semi-transparent black)
      ctx.fillStyle = 'rgba(5, 5, 5, 0.75)'
      ctx.fillRect(0, 0, width, height)

      // 3. Draw 3D Diamond
      // Smooth mouse follow for rotation interaction
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      // Calculate rotation based on time + mouse position
      const rotY = time * 0.5 + (mouseX / width) * Math.PI
      const rotX = Math.sin(time * 0.3) * 0.3 + ((mouseY / height) - 0.5) * Math.PI
      
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
      ctx.beginPath()

      // Project and draw edges
      edges.forEach(([i1, i2]) => {
        let v1 = diamondVertices[i1]
        let v2 = diamondVertices[i2]
        
        // Rotate
        v1 = rotateX(v1, rotX)
        v1 = rotateY(v1, rotY)
        
        v2 = rotateX(v2, rotX)
        v2 = rotateY(v2, rotY)
        
        // Project
        const p1 = project(v1)
        const p2 = project(v2)
        
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
      })
      ctx.stroke()
      
      // Reset shadow for next frame
      ctx.shadowBlur = 0
      
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
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
