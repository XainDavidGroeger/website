/**
 * Interaktive Bot-Posen: Basis-Pose, Hover-Reaktion, Klick-Belohnung.
 * Die Hover-Pose hält mindestens holdMs (Cooldown): Posen sind unterschiedlich
 * breit, ohne Cooldown flackert es, wenn der Zeiger am Rand steht (enter/leave-
 * Schleife). Erst nach Ablauf wird geprüft, ob der Zeiger noch drauf ist.
 */
export function useBotPoses(
  name: 'pixel' | 'forge' | 'prompt' | 'idle',
  poses: { base: number, hover: number, click: number },
  revertMs = 1800,
  holdMs = 2000,
) {
  const pose = ref(poses.base)
  let clickTimer: ReturnType<typeof setTimeout> | null = null
  let holdTimer: ReturnType<typeof setTimeout> | null = null
  let inside = false

  const src = computed(() => `/img/crew/${name}-${pose.value}.webp`)

  onMounted(() => {
    for (const p of [poses.hover, poses.click]) {
      const img = new Image()
      img.src = `/img/crew/${name}-${p}.webp`
    }
  })

  function onEnter() {
    inside = true
    if (clickTimer || holdTimer) return
    pose.value = poses.hover
    holdTimer = setTimeout(() => {
      holdTimer = null
      if (!inside && !clickTimer) pose.value = poses.base
    }, holdMs)
  }
  function onLeave() {
    inside = false
    if (clickTimer || holdTimer) return
    pose.value = poses.base
  }
  /* Pose von außen setzen (z. B. Terminal-Befehle); hat Vorrang vor Hover */
  function set(p: number, ms = revertMs) {
    pose.value = p
    if (holdTimer) clearTimeout(holdTimer)
    holdTimer = null
    if (clickTimer) clearTimeout(clickTimer)
    clickTimer = setTimeout(() => {
      clickTimer = null
      pose.value = poses.base
    }, ms)
  }
  function onClick() {
    set(poses.click)
  }

  onUnmounted(() => {
    if (clickTimer) clearTimeout(clickTimer)
    if (holdTimer) clearTimeout(holdTimer)
  })

  return { src, onEnter, onLeave, onClick, set }
}
