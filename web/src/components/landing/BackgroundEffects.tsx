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

    // Mouse state
    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = width / 2
    let targetMouseY = height / 2

    // --- Diamond Geometry Setup ---
    const vertices: {x: number, y: number, z: number}[] = []
    const faces: number[][] = []
    const segments = 8

    // 0. Bottom tip (Culet) - Shortened
    vertices.push({ x: 0, y: 1.2, z: 0 }) 

    // 1-8. Girdle (Middle ring)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push({
        x: Math.cos(theta) * 1,
        y: 0,
        z: Math.sin(theta) * 1
      })
    }

    // 9-16. Table (Top ring)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push({
        x: Math.cos(theta) * 0.6,
        y: -0.5,
        z: Math.sin(theta) * 0.6
      })
    }

    // 17. Top center (Table center)
    vertices.push({ x: 0, y: -0.5, z: 0 })

    // Define Faces (Triangles)
    // Bottom Pavilion faces
    for (let i = 0; i < segments; i++) {
      const p1 = 1 + i
      const p2 = 1 + ((i + 1) % segments)
      faces.push([0, p2, p1]) 
    }

    // Girdle Facets (Trapezoids -> 2 Triangles each)
    for (let i = 0; i < segments; i++) {
      const g1 = 1 + i
      const g2 = 1 + ((i + 1) % segments)
      const t1 = 9 + i
      const t2 = 9 + ((i + 1) % segments)
      faces.push([g1, g2, t2])
      faces.push([g1, t2, t1])
    }

    // Top Table faces
    for (let i = 0; i < segments; i++) {
      const t1 = 9 + i
      const t2 = 9 + ((i + 1) % segments)
      faces.push([t1, t2, 17])
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

    // 3D Helpers
    const rotateX = (p: {x:number, y:number, z:number}, angle: number) => {
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    
    const rotateY = (p: {x:number, y:number, z:number}, angle: number) => {
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c }
    }

    const project = (p: {x:number, y:number, z:number}) => {
      const fov = 1000
      const distance = 4
      const scale = 250
      const factor = fov / (fov + (p.z + distance) * 100)
      return {
        x: p.x * scale * factor + width / 2,
        y: p.y * scale * factor + height / 2,
        z: p.z 
      }
    }

    const subtract = (v1: any, v2: any) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z })
    const cross = (v1: any, v2: any) => ({
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    })
    const normalize = (v: any) => {
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1
      return { x: v.x / len, y: v.y / len, z: v.z / len }
    }
    const dot = (v1: any, v2: any) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Background - Dark
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)
      
      time += 0.01

      // --- Enhanced Colorful Waves ---
      const waveCount = 12
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        // Dynamic Rainbow Colors
        const hue = (time * 15 + i * (360 / waveCount)) % 360
        
        // Increased Opacity for Visibility
        ctx.strokeStyle = `hsla(${hue}, 60%, 60%, 0.3)`
        ctx.lineWidth = 2
        
        // Wave logic
        const yCenter = height / 2 + (i - waveCount/2) * 50
        
        for (let x = 0; x <= width; x += 30) {
          // Complex sine for "water" feel
          const y = yCenter + 
            Math.sin(x * 0.003 + time * 0.5 + i) * 60 +
            Math.sin(x * 0.01 - time) * 20
            
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      
      // Removed the heavy overlay mask that was hiding the waves!

      // --- Ruby Glass Effect ---
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      const rotY = time * 0.4 + (mouseX / width - 0.5) * 1.5
      const rotX = Math.sin(time * 0.2) * 0.2 + (mouseY / height - 0.5) * 1.5

      const lightDir = normalize({ x: 0.8, y: -0.8, z: -0.8 }) 
      const viewDir = { x: 0, y: 0, z: -1 }

      const projectedFaces = faces.map(faceIndices => {
        const v3d = faceIndices.map(i => {
          let v = vertices[i]
          v = rotateX(v, rotX)
          v = rotateY(v, rotY)
          return v
        })

        const vA = subtract(v3d[1], v3d[0])
        const vB = subtract(v3d[2], v3d[0])
        let normal = normalize(cross(vA, vB))
        
        let intensity = dot(normal, lightDir)
        const v2d = v3d.map(project)
        const avgZ = (v2d[0].z + v2d[1].z + v2d[2].z) / 3

        return { v2d, avgZ, intensity, normal }
      })

      // Sort
      projectedFaces.sort((a, b) => b.avgZ - a.avgZ)

      // 1. Draw Inner Glow (Backside refraction)
      ctx.globalCompositeOperation = 'lighter'
      projectedFaces.forEach(face => {
        const { v2d, intensity, normal } = face
        
        const x1 = v2d[1].x - v2d[0].x
        const y1 = v2d[1].y - v2d[0].y
        const x2 = v2d[2].x - v2d[0].x
        const y2 = v2d[2].y - v2d[0].y
        const area = x1 * y2 - x2 * y1
        const isBack = area <= 0
        
        if (isBack) {
            ctx.beginPath()
            ctx.moveTo(v2d[0].x, v2d[0].y)
            ctx.lineTo(v2d[1].x, v2d[1].y)
            ctx.lineTo(v2d[2].x, v2d[2].y)
            ctx.closePath()
            
            // Back faces glow deep red
            const alpha = 0.2 + Math.max(0, -intensity) * 0.3
            ctx.fillStyle = `rgba(255, 10, 50, ${alpha})`
            ctx.fill()
            
            // Back edges
            ctx.strokeStyle = `rgba(255, 0, 40, 0.3)`
            ctx.lineWidth = 1
            ctx.stroke()
        }
      })
      ctx.globalCompositeOperation = 'source-over'


      // 2. Draw Front Faces (Glass Shell)
      projectedFaces.forEach(face => {
        const { v2d, intensity, normal } = face
        
        const x1 = v2d[1].x - v2d[0].x
        const y1 = v2d[1].y - v2d[0].y
        const x2 = v2d[2].x - v2d[0].x
        const y2 = v2d[2].y - v2d[0].y
        const area = x1 * y2 - x2 * y1
        const isFront = area > 0

        if (isFront) {
            ctx.beginPath()
            ctx.moveTo(v2d[0].x, v2d[0].y)
            ctx.lineTo(v2d[1].x, v2d[1].y)
            ctx.lineTo(v2d[2].x, v2d[2].y)
            ctx.closePath()

            const viewDot = Math.abs(dot(normal, viewDir))
            const fresnel = Math.pow(1 - viewDot, 3) 
            const specular = Math.pow(Math.max(0, intensity), 4)

            // Base Tint - BOOSTED RED
            ctx.fillStyle = `rgba(255, 0, 40, 0.25)` 
            ctx.fill()

            // Reflection / Glint based on Fresnel
            if (fresnel > 0.1) {
                ctx.fillStyle = `rgba(255, 150, 150, ${fresnel * 0.2})`
                ctx.fill()
            }

            // Specular Flash
            if (specular > 0.1) {
                 ctx.fillStyle = `rgba(255, 255, 255, ${specular * 0.7})`
                 ctx.globalCompositeOperation = 'lighter'
                 ctx.fill()
                 ctx.globalCompositeOperation = 'source-over'
            }

            // Edges - Brighter Red/Pink
            ctx.lineWidth = 1.5
            const edgeAlpha = 0.4 + fresnel * 0.5 + specular * 0.5
            ctx.strokeStyle = `rgba(255, 100, 120, ${edgeAlpha})`
            ctx.stroke()
        }
      })

      // 3. Central Flare (Bloom) - Behind text but visible
      const cx = width / 2
      const cy = height / 2
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 350)
      gradient.addColorStop(0, 'rgba(255, 0, 20, 0.3)') // Stronger core glow
      gradient.addColorStop(0.4, 'rgba(255, 0, 20, 0.1)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

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
