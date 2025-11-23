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

    // 0. Bottom tip (Culet)
    vertices.push({ x: 0, y: 1.5, z: 0 }) 

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
        x: Math.cos(theta) * 0.55, // Slightly tighter table
        y: -0.45,
        z: Math.sin(theta) * 0.55
      })
    }

    // 17. Top center (Table center)
    vertices.push({ x: 0, y: -0.45, z: 0 })

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

    // 3D Math Helpers
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
      const scale = 220 // Slightly larger
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
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
      return { x: v.x / len, y: v.y / len, z: v.z / len }
    }
    const dot = (v1: any, v2: any) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z

    const animate = () => {
      // Clear with very slight fade for trail effect? No, clean clear for crisp gem
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)
      
      time += 0.01

      // --- Draw Waves (Subtle) ---
      const waveCount = 15
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        const hue = (time * 10 + i * 20) % 360
        ctx.strokeStyle = `hsla(${hue}, 60%, 40%, 0.15)`
        ctx.lineWidth = 2
        for (let x = 0; x <= width; x += 30) {
          const yOffset = height / 2 + (i - waveCount/2) * 50 
          const y = yOffset + Math.sin(x * 0.002 + time * 0.5 + i) * 60
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // --- Overlay Mask ---
      ctx.fillStyle = 'rgba(5, 5, 5, 0.7)' 
      ctx.fillRect(0, 0, width, height)

      // --- Draw Ruby ---
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      const rotY = time * 0.6 + (mouseX / width - 0.5) * 2
      const rotX = Math.sin(time * 0.3) * 0.3 + (mouseY / height - 0.5) * 1.5

      const lightDir = normalize({ x: 0.5, y: -0.5, z: -1 }) // Light from top-right-front

      const projectedFaces = faces.map(faceIndices => {
        const v3d = faceIndices.map(i => {
          let v = vertices[i]
          v = rotateX(v, rotX)
          v = rotateY(v, rotY)
          return v
        })

        // Normal & Intensity
        const vA = subtract(v3d[1], v3d[0])
        const vB = subtract(v3d[2], v3d[0])
        let normal = normalize(cross(vA, vB))
        let intensity = dot(normal, lightDir)
        
        const v2d = v3d.map(project)
        const avgZ = (v2d[0].z + v2d[1].z + v2d[2].z) / 3

        return { v2d, avgZ, intensity, normal }
      })

      // Sort: Draw back to front for transparency
      projectedFaces.sort((a, b) => b.avgZ - a.avgZ)

      // Use Additive Blending for "Glow" / Internal Refraction effect
      ctx.globalCompositeOperation = 'lighter'

      projectedFaces.forEach(face => {
        const { v2d, intensity } = face
        
        // Face area check for front/back determination
        const x1 = v2d[1].x - v2d[0].x
        const y1 = v2d[1].y - v2d[0].y
        const x2 = v2d[2].x - v2d[0].x
        const y2 = v2d[2].y - v2d[0].y
        const area = x1 * y2 - x2 * y1
        const isFront = area > 0

        ctx.beginPath()
        ctx.moveTo(v2d[0].x, v2d[0].y)
        ctx.lineTo(v2d[1].x, v2d[1].y)
        ctx.lineTo(v2d[2].x, v2d[2].y)
        ctx.closePath()

        // --- Ruby Material Simulation ---
        
        // 1. Specular Highlight (Sharp reflection)
        const specular = Math.pow(Math.max(0, intensity), 8) 
        
        // 2. Base Redness
        // Back faces are darker/deeper red. Front faces are brighter.
        const baseL = isFront ? 30 : 15
        
        // 3. Lighting influence
        // Even back faces catch some internal light (simulated by ignoring negative intensity partially)
        const lightInfluence = Math.abs(intensity) * 20
        
        // 4. Combine
        let l = baseL + lightInfluence + specular * 50
        
        // 5. Transparency (Alpha)
        // High specular = more opaque (reflection)
        // Back faces = more transparent (see through)
        // Front faces = balanced
        let alpha = isFront ? 0.35 : 0.15
        alpha += specular * 0.4 // Highlights are solid

        // Color
        // Hue shifts slightly towards purple/pink in highlights
        const h = 350 + specular * 10 
        const s = 100

        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${alpha})`
        ctx.fill()
        
        // Edges (Facets)
        // Bright edges to define the shape clearly against dark bg
        // Back face edges are dimmer
        const edgeAlpha = isFront ? 0.3 : 0.1
        ctx.strokeStyle = `hsla(${h}, 100%, ${l + 20}%, ${edgeAlpha})`
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Sparkle point on vertices for extra bling?
        // Maybe too much. The additive blending usually handles it.
      })

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over'

      // Final Center Glow (Simulate light trapping in center)
      const centerX = width/2
      const centerY = height/2
      // Only draw if diamond is roughly center (it is)
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300)
      glow.addColorStop(0, 'rgba(255, 0, 50, 0.15)')
      glow.addColorStop(0.5, 'rgba(255, 0, 0, 0.05)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

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
