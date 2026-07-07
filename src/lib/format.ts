const MONTHS_EN = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const

export function formatDateStamp(iso: string): string {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS_EN[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}
