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

    // --- 3D Diamond Geometry Setup ---
    const vertices: {x: number, y: number, z: number}[] = []
    const faces: number[][] = [] // Indices of vertices forming a face
    const segments = 8
    
    // 1. Vertices
    // Index 0: Bottom tip (Culet) - sharp point
    vertices.push({ x: 0, y: 1.8, z: 0 }) 
    
    // Indices 1-8: Middle ring (Girdle)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push({
        x: Math.cos(theta) * 1,
        y: 0,
        z: Math.sin(theta) * 1
      })
    }
    
    // Indices 9-16: Top ring (Table edge)
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push({
        x: Math.cos(theta) * 0.5,
        y: -0.5,
        z: Math.sin(theta) * 0.5
      })
    }

    // Index 17: Top Center (Table center)
    vertices.push({ x: 0, y: -0.5, z: 0 })

    // 2. Faces (Triangles)
    // Bottom Pavillion Faces
    for (let i = 0; i < segments; i++) {
      // Connect Tip (0) to Girdle (1+i) and (1 + (i+1)%seg)
      // Winding order matters for culling/normals, let's assume CCW
      faces.push([0, 1 + (i + 1) % segments, 1 + i])
    }
    
    // Middle Crown Facets (Quads split into 2 triangles)
    for (let i = 0; i < segments; i++) {
      const g1 = 1 + i
      const g2 = 1 + (i + 1) % segments
      const t1 = 9 + i
      const t2 = 9 + (i + 1) % segments
      
      // Triangle 1
      faces.push([g1, t1, t2])
      // Triangle 2
      faces.push([g1, t2, g2])
    }
    
    // Top Table Faces
    for (let i = 0; i < segments; i++) {
      faces.push([17, 9 + i, 9 + (i + 1) % segments])
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

    // Helper: Project 3D to 2D
    const project = (p: {x:number, y:number, z:number}) => {
      const fov = 800
      const distance = 4
      const scale = 180
      const factor = fov / (fov + (p.z + distance) * 100)
      return {
        x: p.x * scale * factor + width / 2,
        y: p.y * scale * factor + height / 2,
        scale: factor // Store scale for z-sorting if needed
      }
    }

    // Helper: Vector operations
    const sub = (v1: {x:number, y:number, z:number}, v2: {x:number, y:number, z:number}) => ({x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z})
    const cross = (v1: {x:number, y:number, z:number}, v2: {x:number, y:number, z:number}) => ({
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    })
    const normalize = (v: {x:number, y:number, z:number}) => {
      const len = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z)
      return {x: v.x/len, y: v.y/len, z: v.z/len}
    }
    const dot = (v1: {x:number, y:number, z:number}, v2: {x:number, y:number, z:number}) => v1.x*v2.x + v1.y*v2.y + v1.z*v2.z

    const animate = () => {
      // 1. Draw Background
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, width, height)
      
      time += 0.01

      // 2. Draw Waves (Distinct, Colorful, Many)
      const waveCount = 8
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        // Random cycling colors
        const hue = (time * 20 + i * (360 / waveCount)) % 360
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.3)` // Increased opacity
        ctx.lineWidth = 3
        
        const yOffset = height / 2 + (i - waveCount/2) * 40
        
        for (let x = 0; x <= width; x += 10) {
          const y = yOffset + 
            Math.sin(x * 0.005 + time + i * 0.5) * 60 + 
            Math.cos(x * 0.01 - time * 0.8) * 40
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        
        // Add a "glow" duplicate line
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.1)`
        ctx.lineWidth = 8
        ctx.stroke()
      }

      // 3. Dark Overlay
      ctx.fillStyle = 'rgba(5, 5, 5, 0.6)'
      ctx.fillRect(0, 0, width, height)

      // 4. Draw Ruby Gem
      
      // Update rotation interaction
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      
      const rotY = time * 0.8 + (mouseX / width - 0.5) * 2
      const rotX = Math.sin(time * 0.5) * 0.2 + (mouseY / height - 0.5) * 2

      // Light source direction (fixed relative to camera)
      const lightDir = normalize({ x: -0.5, y: -1, z: -1 })

      // Transform and Sort Faces
      const projectedFaces = faces.map(faceIndices => {
        const transformedVerts = faceIndices.map(i => {
          let v = vertices[i]
          v = rotateX(v, rotX)
          v = rotateY(v, rotY)
          return v
        })

        // Compute Normal
        const vA = sub(transformedVerts[1], transformedVerts[0])
        const vB = sub(transformedVerts[2], transformedVerts[0])
        let normal = normalize(cross(vA, vB))
        
        // Compute Center Z for sorting (Painter's Algorithm)
        const zDepth = (transformedVerts[0].z + transformedVerts[1].z + transformedVerts[2].z) / 3

        // Lighting calculation
        // Dot product gives -1 to 1. 1 = facing light.
        const intensity = Math.max(0, dot(normal, lightDir))
        
        // Specular highlight (fake)
        // If normal is pointing somewhat towards viewer and light
        const viewDir = {x: 0, y: 0, z: -1}
        const reflection = dot(normal, viewDir) // Simple view-dependent shine
        const specular = Math.pow(Math.max(0, reflection), 3) * 0.8

        return {
          verts: transformedVerts.map(project),
          zDepth,
          intensity,
          specular
        }
      })

      // Sort by depth (furthest first)
      projectedFaces.sort((a, b) => b.zDepth - a.zDepth)

      // Draw Faces
      projectedFaces.forEach(face => {
        ctx.beginPath()
        ctx.moveTo(face.verts[0].x, face.verts[0].y)
        face.verts.forEach((v, i) => {
            if (i > 0) ctx.lineTo(v.x, v.y)
        })
        ctx.closePath()

        // Ruby Color Logic
        // Base: Deep Red (#800000) -> Bright Red (#FF0000)
        // We mix based on intensity
        
        // Base red component (50-255)
        const r = Math.floor(50 + face.intensity * 205)
        // Add specular to G/B to make it white/pinkish shiny
        const g = Math.floor(face.specular * 150)
        const b = Math.floor(face.specular * 150)
        
        // Fill
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fill()
        
        // Edge stroke (for definition)
        ctx.strokeStyle = `rgba(255, 100, 100, 0.3)`
        ctx.lineWidth = 1
        ctx.stroke()
      })
      
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
