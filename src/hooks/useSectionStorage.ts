import { useEffect, useState } from 'react'

/**
 * Reads a section's data from localStorage, the same way AdminTeamSection
 * writes it (localStorage.setItem + window.dispatchEvent(new Event(eventName))).
 *
 * Usage in an Admin*Section.tsx (already how AdminTeamSection.tsx works):
 *   localStorage.setItem('team_section_data', JSON.stringify(data))
 *   window.dispatchEvent(new Event('team-section-updated'))
 *
 * Usage on the public site:
 *   const team = useSectionStorage('team_section_data', 'team-section-updated', defaults)
 *
 * IMPORTANT: adjust `storageKey` / `eventName` per section to match whatever
 * your other Admin*Section.tsx files actually use — this file only assumes
 * the same convention AdminTeamSection.tsx established.
 */
export function useSectionStorage<T>(storageKey: string, eventName: string, defaults: T): T {
  const [data, setData] = useState<T>(() => read(storageKey, defaults))

  useEffect(() => {
    const refresh = () => setData(read(storageKey, defaults))
    refresh()
    window.addEventListener(eventName, refresh)
    window.addEventListener('storage', refresh) // cross-tab updates
    return () => {
      window.removeEventListener(eventName, refresh)
      window.removeEventListener('storage', refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, eventName])

  return data
}

function read<T>(storageKey: string, defaults: T): T {
  const stored = localStorage.getItem(storageKey)
  if (!stored) return defaults
  try {
    return { ...defaults, ...JSON.parse(stored) }
  } catch (e) {
    console.error(`Error parsing stored data for ${storageKey}`, e)
    return defaults
  }
}
