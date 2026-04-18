<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const startText = '<'
const targetText = "<Loading/>"
const displayText = ref(startText)

let animationTimeouts: ReturnType<typeof setTimeout>[] = []

function clearAllTimers() {
  animationTimeouts.forEach(clearTimeout)
  animationTimeouts = []
}

function runAnimation() {
  clearAllTimers()

  displayText.value = startText

  const initialPause = 120
  const typingDuration = 800
  const finalPause = 700

  const charsToType = targetText.length - 1
  const stepTime = typingDuration / charsToType

  animationTimeouts.push(
    setTimeout(() => {
      displayText.value = '<'

      for (let i = 2; i <= targetText.length; i++) {
        animationTimeouts.push(
          setTimeout(() => {
            displayText.value = targetText.slice(0, i)
          }, stepTime * (i - 1))
        )
      }

      animationTimeouts.push(
        setTimeout(() => {
          runAnimation()
        }, typingDuration + finalPause)
      )
    }, initialPause)
  )
}

onMounted(() => {
  runAnimation()
})

onBeforeUnmount(() => {
  clearAllTimers()
})
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <span class="font-mono text-2xl text-[var(--text-main)]">
      {{ displayText }}<span class="animate-pulse">|</span>
    </span>
  </div>
</template>
