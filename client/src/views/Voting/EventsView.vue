<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingAnimation from '@/components/common/LoadingAnimation.vue'
import { formatDate } from '@/utils/formatDate.util'
import API from '@/services/API'

interface Candidate {
  id: number
  name: string
  photo_url?: string
  faculty?: string
  nim?: string
  vision?: string
}

interface Event {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
  candidates?: Candidate[]
}

const router = useRouter()
const events = ref<Event[]>([])
const loading = ref(true)

const fetchEvents = async () => {
  try {
    const response = await API().get('/events')
    events.value = response.data.data
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

const isWithinVotingPeriod = (event: Event): boolean => {
  const now = new Date()
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  return now >= startDate && now <= endDate
}

const goToVoting = (eventId: number) => {
  router.push({ name: 'voting', params: { eventId: eventId.toString() } })
}

const viewResults = (eventId: number) => {
  router.push({ name: 'results', params: { eventId: eventId.toString() } })
}

const getVotingProgress = (event: Event): number => {
  const now = new Date().getTime()
  const start = new Date(event.start_date).getTime()
  const end = new Date(event.end_date).getTime()
  
  if (now < start) return 0
  if (now > end) return 100
  
  const total = end - start
  const elapsed = now - start
  return Math.round((elapsed / total) * 100)
}

const getTimeRemaining = (endDate: string): string => {
  const now = new Date().getTime()
  const end = new Date(endDate).getTime()
  const diff = end - now
  
  if (diff <= 0) return 'Berakhir'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}h ${hours}j`
  if (hours > 0) return `${hours}j ${minutes}m`
  return `${minutes}m`
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-title-md2 font-semibold text-black dark:text-white">
            Voting Events
          </h1>
          <p class="font-medium text-gray-600 dark:text-gray-400">
            Pilih event voting yang tersedia
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingAnimation :state="true"/>
      </div>

      <!-- Events Grid -->
      <div v-else-if="events.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(event, index) in events"
          :key="event.id"
          class="group relative overflow-hidden rounded-2xl border border-stroke bg-gradient-to-br from-white to-gray-50 p-6 shadow-default transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:border-strokedark dark:from-boxdark dark:to-boxdark/80 hover:border-primary/20 dark:hover:border-primary/30 animate-[fadeInUp_0.6s_ease-out_forwards]"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Event Status Badge -->
          <div class="mb-4 flex items-center justify-between">
            <span
              :class="{
                'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-green-200 dark:shadow-green-800': event.is_active,
                'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200 dark:shadow-gray-800': !event.is_active
              }"
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg transition-all duration-200 group-hover:shadow-xl"
            >
              <div :class="{'bg-white': event.is_active, 'bg-gray-300': !event.is_active}" class="mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse"></div>
              {{ event.is_active ? '🟢 Active' : '⚫ Inactive' }}
            </span>
            <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-primary-light">
              👥 {{ event.candidates?.length || 0 }} kandidat
            </span>
          </div>

          <!-- Event Title -->
          <h3 class="mb-3 text-xl font-bold text-black dark:text-white group-hover:text-primary transition-colors duration-200">
            {{ event.title }}
          </h3>

          <!-- Event Description -->
          <p class="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 [-webkit-line-clamp:3] [-webkit-box-orient:vertical] [display:-webkit-box] overflow-hidden">
            {{ event.description }}
          </p>

          <!-- Event Period with Progress -->
          <div class="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div class="mb-2 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
              <span>📅 Periode Voting</span>
              <span v-if="event.is_active && isWithinVotingPeriod(event)" class="text-green-600 dark:text-green-400">
                ⏰ {{ getTimeRemaining(event.end_date) }}
              </span>
            </div>
            
            <!-- Progress Bar -->
            <div v-if="event.is_active" class="mb-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                :style="{ width: getVotingProgress(event) + '%' }"
                class="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
              ></div>
            </div>
            
            <div class="space-y-1 text-xs text-gray-500">
              <p class="flex items-center">
                <span class="mr-2">🚀</span>
                <span class="font-medium">Mulai:</span> 
                <span class="ml-1">{{ formatDate(event.start_date) }}</span>
              </p>
              <p class="flex items-center">
                <span class="mr-2">🏁</span>
                <span class="font-medium">Berakhir:</span>
                <span class="ml-1">{{ formatDate(event.end_date) }}</span>
              </p>
            </div>
          </div>

          <!-- Candidates Preview -->
          <div v-if="event.candidates && event.candidates.length > 0" class="mb-6">
            <div class="mb-4 flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="mr-2 h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                Candidates
              </h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ event.candidates.length }} kandidat
              </span>
            </div>

            <!-- Candidate Cards Grid -->
            <div class="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div
                v-for="candidate in event.candidates.slice(0, 4)"
                :key="candidate.id"
                class="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 dark:border-gray-700 dark:bg-boxdark-2 hover:scale-[1.02]"
                role="button"
                :aria-label="`Preview candidate ${candidate.name}`"
                tabindex="0"
                @click="goToVoting(event.id)"
                @keydown.enter="goToVoting(event.id)"
                @keydown.space.prevent="goToVoting(event.id)"
              >
                <div class="flex items-center space-x-3">
                  <!-- Candidate Photo -->
                  <div class="relative flex-shrink-0">
                    <img
                      :src="candidate.photo_url || '/images/user/user-01.png'"
                      :alt="`${candidate.name} profile photo`"
                      class="h-10 w-10 rounded-full border-2 border-gray-200 object-cover transition-transform duration-200 group-hover:scale-105 dark:border-gray-600"
                    />
                    <div class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-green-400 dark:border-boxdark" aria-hidden="true"></div>
                  </div>

                  <!-- Candidate Info -->
                  <div class="flex-1 min-w-0">
                    <h5 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ candidate.name }}
                    </h5>
                    <p class="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {{ candidate.faculty || 'Faculty not specified' }}
                    </p>
                    <p v-if="candidate.nim" class="text-xs text-gray-500 dark:text-gray-500">
                      {{ candidate.nim }}
                    </p>
                  </div>

                  <!-- Quick Action Indicator -->
                  <div class="opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex-shrink-0">
                    <div class="rounded-full bg-primary/10 p-1.5">
                      <svg class="h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Show More Candidates Card -->
              <div
                v-if="event.candidates.length > 4"
                class="group flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 transition-all duration-200 hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:bg-gray-800/50 hover:scale-[1.02]"
                role="button"
                :aria-label="`View all ${event.candidates.length} candidates for ${event.title}`"
                tabindex="0"
                @click="goToVoting(event.id)"
                @keydown.enter="goToVoting(event.id)"
              >
                <div class="text-center">
                  <div class="mb-2 flex justify-center">
                    <div class="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                      <svg class="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                  </div>
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    +{{ event.candidates.length - 4 }} more
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    View all candidates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              v-if="event.is_active && isWithinVotingPeriod(event)"
              @click="goToVoting(event.id)"
              class="group/btn flex-1 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:from-primary/90 hover:to-blue-600/90"
            >
              <span class="flex items-center justify-center">
                <span class="mr-2 transition-transform duration-200 group-hover/btn:scale-110">🗳️</span>
                Vote Sekarang
              </span>
            </button>
            <button
              v-else-if="!event.is_active"
              disabled
              class="flex-1 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 px-4 py-3 text-sm font-medium text-gray-600 cursor-not-allowed dark:from-gray-700 dark:to-gray-600 dark:text-gray-400"
            >
              <span class="flex items-center justify-center">
                <span class="mr-2">❌</span>
                Event Tidak Aktif
              </span>
            </button>
            <button
              v-else
              disabled
              class="flex-1 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 px-4 py-3 text-sm font-medium text-gray-600 cursor-not-allowed dark:from-gray-700 dark:to-gray-600 dark:text-gray-400"
            >
              <span class="flex items-center justify-center">
                <span class="mr-2">🔒</span>
                Voting Ditutup
              </span>
            </button>
            
            <button
              @click="viewResults(event.id)"
              class="group/result rounded-xl border-2 border-primary/20 bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl dark:bg-boxdark dark:text-primary-light"
            >
              <span class="flex items-center justify-center">
                <span class="mr-2 transition-transform duration-200 group-hover/result:scale-110">📊</span>
                Hasil
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <div class="rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 p-8 mb-6">
          <div class="text-6xl">🗳️</div>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Belum Ada Event Voting
        </h3>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Saat ini belum ada event voting yang tersedia. Event voting baru akan muncul di sini ketika sudah dibuat oleh admin.
        </p>
        <div class="flex space-x-4">
          <button
            @click="fetchEvents"
            class="rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <span class="flex items-center">
              <span class="mr-2">🔄</span>
              Refresh
            </span>
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>