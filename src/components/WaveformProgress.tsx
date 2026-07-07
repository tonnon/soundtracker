import { useEffect, useMemo, useState } from 'react'
import { generateWaveformBars } from '@/lib/waveform'
import { CATEGORY_META } from '@/lib/category'
import type { Category } from '@/data/types'
import { cn } from '@/lib/utils'

interface WaveformProgressProps {
  seed: string
  category: Category
  bars?: number
}

const VIEW_HEIGHT = 24
const BAR_WIDTH = 2
const BAR_GAP = 2

export function WaveformProgress({ seed, category, bars = 160 }: WaveformProgressProps) {
  const [progress, setProgress] = useState(0)
  const amplitudes = useMemo(() => generateWaveformBars(seed, bars), [seed, bars])
  const meta = CATEGORY_META[category]
  const viewWidth = bars * (BAR_WIDTH + BAR_GAP)
  const filledBars = Math.round(progress * bars)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div
      className="sticky top-16 z-40 h-6 w-full border-b border-line bg-surface/95 backdrop-blur-sm"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {amplitudes.map((amplitude, index) => {
          const height = Math.max(1.5, amplitude * VIEW_HEIGHT * 0.75)
          const x = index * (BAR_WIDTH + BAR_GAP)
          const y = (VIEW_HEIGHT - height) / 2
          const filled = index < filledBars
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={height}
              rx={1}
              className={cn(filled ? meta.text : 'text-line', 'transition-colors duration-150')}
              fill="currentColor"
            />
          )
        })}
      </svg>
    </div>
  )
}
