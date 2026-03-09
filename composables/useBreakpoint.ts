export function useBreakpoint() {
  const width = ref<number | null>(null)

  const isMobile = computed(() => width.value !== null && width.value < 768)
  const isTablet = computed(() => width.value !== null && width.value >= 768 && width.value < 1024)
  const isDesktop = computed(() => width.value !== null && width.value >= 1024)

  function updateWidth() {
    width.value = window.innerWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
  }
}
