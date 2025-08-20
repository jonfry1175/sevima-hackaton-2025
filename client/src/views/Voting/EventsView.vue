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
          v-for="event in events"
          :key="event.id"
          class="rounded-lg border border-stroke bg-white p-6 shadow-default transition-all duration-200 hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
        >
          <!-- Event Status Badge -->
          <div class="mb-4 flex items-center justify-between">
            <span
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': event.is_active,
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300': !event.is_active
              }"
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {{ event.is_active ? 'Active' : 'Inactive' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ event.candidates?.length || 0 }} kandidat
            </span>
          </div>

          <!-- Event Title -->
          <h3 class="mb-2 text-xl font-semibold text-black dark:text-white">
            {{ event.title }}
          </h3>

          <!-- Event Description -->
          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {{ event.description }}
          </p>

          <!-- Event Period -->
          <div class="mb-4 space-y-1 text-sm text-gray-500">
            <p>
              <span class="font-medium">Mulai:</span> 
              {{ formatDate(event.start_date) }}
            </p>
            <p>
              <span class="font-medium">Berakhir:</span>
              {{ formatDate(event.end_date) }}
            </p>
          </div>

          <!-- Candidates Preview -->
          <div v-if="event.candidates && event.candidates.length > 0" class="mb-4">
            <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kandidat:</p>
            <div class="flex -space-x-2">
              <img
                v-for="(candidate, index) in event.candidates.slice(0, 3)"
                :key="candidate.id"
                :src="candidate.photo_url || '/images/user/user-01.png'"
                :alt="candidate.name"
                :title="candidate.name"
                class="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-boxdark"
              />
              <div
                v-if="event.candidates.length > 3"
                class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500 dark:border-boxdark dark:bg-gray-800 dark:text-gray-400"
              >
                +{{ event.candidates.length - 3 }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2">
            <button
              v-if="event.is_active && isWithinVotingPeriod(event)"
              @click="goToVoting(event.id)"
              class="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Vote Sekarang
            </button>
            <button
              v-else-if="!event.is_active"
              disabled
              class="flex-1 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            >
              Event Tidak Aktif
            </button>
            <button
              v-else
              disabled
              class="flex-1 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            >
              Voting Ditutup
            </button>
            
            <button
              @click="viewResults(event.id)"
              class="rounded-md border border-stroke bg-gray-2 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-3 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4/90"
            >
              Lihat Hasil
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12">
        <DataNotFound :condition="events.length === 0"/>
        <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
          Belum ada event voting tersedia
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingAnimation from '@/components/common/LoadingAnimation.vue'
import DataNotFound from '@/components/common/DataNotFound.vue'
import { formatDate } from '@/utils/formatDate.util'
import API from '@/services/API'

interface Candidate {
  id: number
  name: string
  photo_url?: string
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

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>