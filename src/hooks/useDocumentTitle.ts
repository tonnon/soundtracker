import { useEffect } from 'react'

const SITE_NAME = 'soundtracker'

export function useDocumentTitle(title: string, description?: string): void {
  useEffect(() => {
    document.title = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`

    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      meta?.setAttribute('content', description)
    }
  }, [title, description])
}
