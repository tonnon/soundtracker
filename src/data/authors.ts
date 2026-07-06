import type { Author } from './types'

export const AUTHORS = {
  marina: {
    id: 'marina-kessler',
    name: 'Marina Kessler',
    role: 'Editora de Cinema',
    avatarSeed: 'marina-kessler',
  },
  theo: {
    id: 'theo-bandeira',
    name: 'Théo Bandeira',
    role: 'Editor de Séries',
    avatarSeed: 'theo-bandeira',
  },
  priya: {
    id: 'priya-nakamura',
    name: 'Priya Nakamura',
    role: 'Repórter de Games',
    avatarSeed: 'priya-nakamura',
  },
  rafael: {
    id: 'rafael-otsuka',
    name: 'Rafael Otsuka',
    role: 'Colunista de Música Orquestral',
    avatarSeed: 'rafael-otsuka',
  },
  luiza: {
    id: 'luiza-prado',
    name: 'Luiza Prado',
    role: 'Editora-chefe',
    avatarSeed: 'luiza-prado',
  },
} satisfies Record<string, Author>

export const AUTHOR_LIST: Author[] = Object.values(AUTHORS)
