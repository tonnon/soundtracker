import type { Category } from '@/data/types'

interface CategoryMeta {
  label: string
  description: string
  text: string
  bg: string
  border: string
  bgSoft: string
  decorativeFill: string
  groupHoverText: string
  groupHoverBorder: string
}

export const CATEGORY_ORDER: Category[] = ['cinema', 'series', 'games']

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  cinema: {
    label: 'Cinema',
    description: 'Feature film scores, composer profiles, and the race for original score awards.',
    text: 'text-amber',
    bg: 'bg-amber',
    border: 'border-amber',
    bgSoft: 'bg-amber/10',
    decorativeFill: 'fill-amber',
    groupHoverText: 'group-hover:text-amber',
    groupHoverBorder: 'group-hover:border-amber',
  },
  series: {
    label: 'Series',
    description: 'Themes, leitmotifs, and scoring under the pressure of the episodic format.',
    text: 'text-signal',
    bg: 'bg-signal',
    border: 'border-signal',
    bgSoft: 'bg-signal/10',
    decorativeFill: 'fill-signal',
    groupHoverText: 'group-hover:text-signal',
    groupHoverBorder: 'group-hover:border-signal',
  },
  games: {
    label: 'Games',
    description: 'Adaptive scoring, interactive audio, and the soundscape that reacts to the player.',
    text: 'text-rec',
    bg: 'bg-rec',
    border: 'border-rec',
    bgSoft: 'bg-rec/10',
    decorativeFill: 'fill-rec',
    groupHoverText: 'group-hover:text-rec',
    groupHoverBorder: 'group-hover:border-rec',
  },
}

export function isCategory(value: string): value is Category {
  return value === 'cinema' || value === 'series' || value === 'games'
}
