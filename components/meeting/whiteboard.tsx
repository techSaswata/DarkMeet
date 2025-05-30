'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Palette, Eraser, Download, Sparkles, Undo, Redo } from 'lucide-react'

interface WhiteboardProps {
  onClose: () => void
}

export function Whiteboard({ onClose }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#00d4ff')
  const [brushSize, setBrushSize] = useState(3)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.strokeStyle = tool === 'eraser' ? '#000000' : color
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const analyzeWithAI = () => {
    // TODO: Implement AI analysis
    console.log('Analyzing whiteboard with AI...')
  }

  const colors = ['#00d4ff', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-6xl h-full max-h-[80vh] glass-dark rounded-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">AI Whiteboard</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tools */}
            <div className="flex space-x-2">
              <button
                onClick={() => setTool('pen')}
                className={`toolbar-button ${tool === 'pen' ? 'active' : ''}`}
              >
                <Palette className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`toolbar-button ${tool === 'eraser' ? 'active' : ''}`}
              >
                <Eraser className="h-4 w-4" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex space-x-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    color === c ? 'border-white scale-110' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-300 w-6">{brushSize}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="toolbar-button" title="Undo">
              <Undo className="h-4 w-4" />
            </button>
            <button className="toolbar-button" title="Redo">
              <Redo className="h-4 w-4" />
            </button>
            <button onClick={clearCanvas} className="btn-secondary">
              Clear
            </button>
            <button onClick={analyzeWithAI} className="btn-primary flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Analyze with AI</span>
            </button>
            <button className="toolbar-button" title="Download">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded-lg cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* AI Suggestions */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-dark rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-neon-purple" />
              <span className="text-sm font-medium text-white">AI Suggestions</span>
            </div>
            <p className="text-sm text-gray-300">
              Draw something and click "Analyze with AI" to get intelligent suggestions and improvements!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 