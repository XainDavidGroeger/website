export function useTheme() {
  function setTheme(theme: 'dark' | 'light') {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    }
    catch {
      /* Private Mode o. Ä. — Theme gilt dann nur für die Session */
    }
  }

  function toggle() {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    const next = current === 'light' ? 'dark' : 'light'
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => setTheme(next))
    }
    else {
      setTheme(next)
    }
  }

  return { toggle }
}
