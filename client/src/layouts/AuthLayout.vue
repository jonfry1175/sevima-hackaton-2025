<script setup lang="ts">
import { useDarkModeStore } from '@/stores/darkMode'
import { onMounted } from 'vue'
import video from '@/assets/videos/tf_mc3.mp4'

defineProps<{
  page: string
  description?: string | null
}>()

const { setDarkMode } = useDarkModeStore()

onMounted(() => {
  setDarkMode(true)
})
</script>

<template>
  <div
    class="bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 dark text-white font-[sans-serif]"
  >
    <div class="min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="inline-flex items-center space-x-2">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">T</span>
            </div>
            <span class="text-2xl font-bold text-white">TailAdmin</span>
          </div>
        </div>

        <div class="p-8 rounded-2xl bg-white/10 shadow-xl backdrop-blur-xl border border-white/20">
          <h2 class="text-center text-3xl font-bold text-white tracking-wide">{{ page }}</h2>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
