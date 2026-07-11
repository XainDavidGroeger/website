export default defineNuxtPlugin((nuxtApp) => {
  let enabled = false
  if (import.meta.client) {
    enabled
      = window.matchMedia('(pointer: fine)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  nuxtApp.vueApp.directive('tilt', {
    mounted(el: HTMLElement) {
      if (!enabled) return
      el.addEventListener('mousemove', (ev: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = (ev.clientX - rect.left) / rect.width - 0.5
        const y = (ev.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(4px)`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = ''
      })
    },
    getSSRProps() {
      return {}
    },
  })
})
