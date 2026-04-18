<script setup lang="ts">
const theme = useState<'dark' | 'light'>('theme', () => 'dark')

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'

  if (import.meta.client) {
    document.documentElement.classList.toggle('light', theme.value === 'light')
    localStorage.setItem('theme', theme.value)
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null

  if (savedTheme) {
    theme.value = savedTheme
  }

  document.documentElement.classList.toggle('light', theme.value === 'light')
})
</script>

<template>
  <button @click="toggleTheme" class="p-2 ">
  <span v-if="theme === 'dark'" class="block w-5 h-5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  </span>

    <span v-else class="block w-5 h-5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </span>
  </button>
</template>
