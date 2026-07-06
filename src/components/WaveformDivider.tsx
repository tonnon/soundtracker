import { useMemo } from 'react'
import { generateWaveformBars } from '@/lib/waveform'
import { cn } from '@/lib/utils'

interface WaveformDividerProps {
  seed?: string
  bars?: number
  className?: string
}

const VIEW_HEIGHT = 20
const BAR_WIDTH = 2
const BAR_GAP = 3

export function WaveformDivider({ seed = 'soundtracker', bars = 90, className }: WaveformDividerProps) {
  const amplitudes = useMemo(() => generateWaveformBars(seed, bars), [seed, bars])
  const viewWidth = bars * (BAR_WIDTH + BAR_GAP)

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      className={cn('h-5 w-full text-line', className)}
      role="presentation"
      aria-hidden="true"
    >
      {amplitudes.map((amplitude, index) => {
        const height = Math.max(1, amplitude * VIEW_HEIGHT * 0.4)
        const x = index * (BAR_WIDTH + BAR_GAP)
        const y = (VIEW_HEIGHT - height) / 2
        return <rect key={index} x={x} y={y} width={BAR_WIDTH} height={height} rx={1} fill="currentColor" />
      })}
    </svg>
  )
}
