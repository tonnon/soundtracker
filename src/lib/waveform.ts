function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Generates deterministic bar amplitudes (0.12–1) from a text seed, so the same
 * article always renders the same waveform shape instead of reshuffling on rerender. */
export function generateWaveformBars(seed: string, count: number): number[] {
  const random = mulberry32(hashSeed(seed))
  return Array.from({ length: count }, () => 0.12 + random() * 0.88)
}
