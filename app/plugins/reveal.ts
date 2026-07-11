export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null
  let reduced = false

  if (import.meta.client) {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io!.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement) {
      if (reduced || !io) {
        el.classList.add('in')
        return
      }
      el.classList.add('reveal')
      io.observe(el)
    },
    getSSRProps() {
      return {}
    },
  })
})
