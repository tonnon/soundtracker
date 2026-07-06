const MONTHS_PT_BR = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
] as const

export function formatCueNumber(index: number): string {
  return `CUE ${String(index).padStart(3, '0')}`
}

export function formatDateStamp(iso: string): string {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS_PT_BR[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatReadingTime(minutes: number): string {
  return `${String(minutes).padStart(2, '0')} MIN`
}

export function formatCueSheet(cueNumber: number, publishedAt: string, readingTimeMin: number): string {
  return [formatCueNumber(cueNumber), formatDateStamp(publishedAt), formatReadingTime(readingTimeMin)].join(' · ')
}

export function formatDateLong(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
