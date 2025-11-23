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
      faces.push([0, p2, p1]) // Bottom tip -> ring points (CCW order for normal calculation)
    }

    // Girdle Facets (Trapezoids -> 2 Triangles each)
    for (let i = 0; i < segments; i++) {
      const g1 = 1 + i
      const g2 = 1 + ((i + 1) % segments)
      const t1 = 9 + i
      const t2 = 9 + ((i + 1) % segments)
      
      // Triangle 1
      faces.push([g1, g2, t2])
      // Triangle 2
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
      const scale = 180
      const factor = fov / (fov + (p.z + distance) * 100)
      return {
        x: p.x * scale * factor + width / 2,
        y: p.y * scale * factor + height / 2,
        z: p.z // Keep Z for sorting
      }
    }

    // Vector operations for lighting
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
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)
      
      time += 0.015

      // --- Draw Colorful Random Waves ---
      const waveCount = 20 // Increased count
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        
        // Random cycling colors
        // Hue shifts with time and wave index
        const hue = (time * 20 + i * (360 / waveCount) + Math.sin(time) * 50) % 360
        const saturation = 70 + Math.sin(i + time) * 30
        const lightness = 50 + Math.cos(i - time) * 20
        const alpha = 0.2 + Math.sin(time + i) * 0.1 // Varied opacity

        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
        ctx.lineWidth = 2 + Math.sin(i) * 1
        
        // Wave shape
        for (let x = 0; x <= width; x += 20) {
          const yOffset = height / 2 + (i - waveCount/2) * 40 // Spread vertically
          
          // Complex sine wave combination for "random" look
          const y = yOffset + 
            Math.sin(x * 0.002 + time * 0.5 + i) * 80 + 
            Math.sin(x * 0.01 - time * 0.8) * 30
          
          if (x === 0) ctx.moveTo(x, y)
          else {
            // Bezier curve for smoothness could be better, but lineTo is faster
            ctx.lineTo(x, y) 
          }
        }
        ctx.stroke()
      }

      // --- Overlay Mask ---
      ctx.fillStyle = 'rgba(5, 5, 5, 0.65)' // Slightly less opaque to show waves better
      ctx.fillRect(0, 0, width, height)

      // --- Draw Red Ruby/Diamond ---
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      // Rotations
      const rotY = time * 0.8 + (mouseX / width - 0.5) * 2
      const rotX = Math.sin(time * 0.5) * 0.2 + (mouseY / height - 0.5) * 2

      // Light source vector (fixed relative to camera)
      const lightDir = normalize({ x: 0.5, y: -1, z: -1 })

      // Transform and Sort Faces
      const projectedFaces = faces.map(faceIndices => {
        // Get 3D vertices for this face
        const v3d = faceIndices.map(i => {
          let v = vertices[i]
          v = rotateX(v, rotX)
          v = rotateY(v, rotY)
          return v
        })

        // Calculate Normal and Lighting in 3D space
        const vA = subtract(v3d[1], v3d[0])
        const vB = subtract(v3d[2], v3d[0])
        let normal = normalize(cross(vA, vB))
        
        // Intensity
        // We take absolute value or clamp dot product depending on if we want 2-sided lighting
        // For a gem, we want 'shiny' reflections.
        let intensity = dot(normal, lightDir)
        
        // Specular highlight approximation (shininess)
        // If face is facing light, it gets brighter
        // If normal creates a reflection vector pointing to camera (0,0,-1), it gleams white
        
        // Project to 2D
        const v2d = v3d.map(project)

        // Calculate Average Z for sorting
        const avgZ = (v2d[0].z + v2d[1].z + v2d[2].z) / 3

        return { v2d, avgZ, intensity }
      })

      // Painter's Algorithm: Sort by Z (furthest first)
      projectedFaces.sort((a, b) => b.avgZ - a.avgZ)

      // Render Faces
      projectedFaces.forEach(face => {
        const { v2d, intensity } = face
        
        // Back-face culling (simple check if face is wound CCW or CW)
        // Compute 2D signed area
        const x1 = v2d[1].x - v2d[0].x
        const y1 = v2d[1].y - v2d[0].y
        const x2 = v2d[2].x - v2d[0].x
        const y2 = v2d[2].y - v2d[0].y
        const area = x1 * y2 - x2 * y1
        
        // Only draw if facing camera (area > 0 or < 0 depending on coord system)
        // Canvas Y is down, so standard CCW might be reversed.
        // Let's draw everything for transparency effect or just front faces?
        // Gem needs to look solid.
        
        if (area < 0) return; // Simple culling

        ctx.beginPath()
        ctx.moveTo(v2d[0].x, v2d[0].y)
        ctx.lineTo(v2d[1].x, v2d[1].y)
        ctx.lineTo(v2d[2].x, v2d[2].y)
        ctx.closePath()

        // --- Ruby Color Calculation ---
        // Base Red: Hue 350-360 or 0-10
        // Shadow side: Dark Red (L < 20%)
        // Lit side: Bright Red (L ~ 50%)
        // Specular: Pink/White (L > 80%)
        
        // Map intensity (-1 to 1) to Lighting
        // Normal range for dot is -1 to 1.
        // We only care about front facing to light mostly for specular.
        
        const baseHue = 355 // Deep Red
        let litIntensity = Math.max(0, intensity) // 0 to 1
        
        // Add ambient light
        litIntensity = 0.2 + litIntensity * 0.8
        
        // Specular boost
        // Use a power curve for sharpness
        const specular = Math.pow(Math.max(0, intensity), 4) 
        
        const l = 10 + litIntensity * 40 + specular * 50
        const s = 100 - specular * 50 // Desaturate highlight
        
        ctx.fillStyle = `hsl(${baseHue}, ${s}%, ${l}%)`
        ctx.fill()
        
        // Edge stroke for facet definition
        ctx.strokeStyle = `hsla(${baseHue}, 100%, ${l + 20}%, 0.5)`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Add a final glow for the gem
      // We can fake it with a radial gradient at center
      const centerX = width/2
      const centerY = height/2
      const glow = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 200)
      glow.addColorStop(0, 'rgba(255, 0, 50, 0.2)')
      glow.addColorStop(1, 'rgba(255, 0, 0, 0)')
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
