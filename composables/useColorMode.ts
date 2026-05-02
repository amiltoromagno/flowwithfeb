let watcherSet = false

export const useColorMode = () => {
  const colorMode = useState<'light' | 'dark'>('color-mode', () => 'light')

  const toggle = () => {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
  }

  const isDark = computed(() => colorMode.value === 'dark')

  if (import.meta.client && !watcherSet) {
    watcherSet = true

    const stored = localStorage.getItem('color-mode')
    if (stored === 'dark' || stored === 'light') {
      colorMode.value = stored
    }

    watch(colorMode, (val) => {
      localStorage.setItem('color-mode', val)
      document.documentElement.classList.toggle('dark', val === 'dark')
    }, { immediate: true })
  }

  return { colorMode, isDark, toggle }
}
