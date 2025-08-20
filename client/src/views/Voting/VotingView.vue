
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingAnimation from '@/components/common/LoadingAnimation.vue'
import DataNotFound from '@/components/common/DataNotFound.vue'
import { formatDate } from '@/utils/formatDate.util'
import API from '@/services/API'
import useToast from '@/composables/useToast'

interface Candidate {
  id: number
  name: string
  nim?: string
  photo_url?: string
  vision?: string
  mission?: string
  faculty?: string
}

interface Event {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

interface VoteStatus {
  has_voted: boolean
  vote_id?: number
  candidate?: {
    id: number
    name: string
    photo_url?: string
  }
  voted_at?: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const event = ref<Event | null>(null)
const candidates = ref<Candidate[]>([])
const userVote = ref<VoteStatus | null>(null)
const selectedCandidate = ref<number | null>(null)
const loading = ref(true)
const submitting = ref(false)

const eventId = computed(() => parseInt(route.params.eventId as string))
const hasVoted = computed(() => userVote.value?.has_voted || false)

const fetchEventData = async () => {
  try {
    // Fetch event details
    const eventResponse = await API().get(`/events/${eventId.value}`)
    event.value = eventResponse.data.data
    candidates.value = eventResponse.data.data.candidates || []

    // Check if user has voted
    const voteStatusResponse = await API().get(`/votes/status/${eventId.value}`)
    userVote.value = voteStatusResponse.data.data
  } catch (error: any) {
    console.error('Error fetching event data:', error)
    toast.add({
      detail: error.response?.data?.message || 'Gagal memuat data event',
      severity: 'error'
    })
  } finally {
    loading.value = false
  }
}

const selectCandidate = (candidateId: number) => {
  if (hasVoted.value) return
  selectedCandidate.value = candidateId
}

const submitVote = async () => {
  if (!selectedCandidate.value || submitting.value) return

  submitting.value = true
  try {
    await API().post('/votes', {
      event_id: eventId.value,
      candidate_id: selectedCandidate.value
    })
    toast.add({
      summary: 'Suara berhasil dikirim!'
    })

    // Refresh vote status
    await fetchEventData()
  } catch (error: any) {
    console.error('Error submitting vote:', error)
    const message = error.response?.data?.message || 'Gagal mengirim suara'
    toast.add({
      detail: message
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchEventData()
})
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingAnimation :state="false" />
      </div>

      <div v-else>
        <!-- Event Header -->
        <div v-if="event" class="mb-8 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h1 class="text-title-lg font-semibold text-black dark:text-white">
                {{ event.title }}
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                {{ event.description }}
              </p>
            </div>
            <span
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': event.is_active,
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': !event.is_active
              }"
              class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            >
              {{ event.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Voting Period -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="text-sm">
              <span class="font-medium text-gray-700 dark:text-gray-300">Mulai:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">
                {{ formatDate(event.start_date) }}
              </span>
            </div>
            <div class="text-sm">
              <span class="font-medium text-gray-700 dark:text-gray-300">Berakhir:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">
                {{ formatDate(event.end_date) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Vote Status Check -->
        <div v-if="hasVoted" class="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-green-800 dark:text-green-200">
                Terima kasih! Anda sudah memberikan suara
              </h3>
              <p class="mt-2 text-green-700 dark:text-green-300">
                Anda telah memilih: <strong>{{ userVote?.candidate?.name }}</strong>
              </p>
              <p class="text-sm text-green-600 dark:text-green-400">
                Waktu voting: {{ formatDate(userVote?.voted_at!) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Candidates Grid -->
        <div v-if="!hasVoted && candidates.length > 0" class="mb-8">
          <h2 class="mb-6 text-xl font-semibold text-black dark:text-white">
            Pilih Kandidat Anda
          </h2>
          
          <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <div
              v-for="candidate in candidates"
              :key="candidate.id"
              :class="{
                'ring-2 ring-primary': selectedCandidate === candidate.id,
                'hover:shadow-lg': selectedCandidate !== candidate.id
              }"
              @click="selectCandidate(candidate.id)"
              class="cursor-pointer rounded-lg border border-stroke bg-white p-6 shadow-default transition-all duration-200 dark:border-strokedark dark:bg-boxdark"
            >
              <!-- Candidate Photo -->
              <div class="mb-4 flex justify-center">
                <img
                  :src="candidate.photo_url || '/images/user/user-01.png'"
                  :alt="candidate.name"
                  class="h-24 w-24 rounded-full border-4 border-gray-200 object-cover dark:border-gray-700"
                />
              </div>

              <!-- Candidate Info -->
              <div class="text-center">
                <h3 class="mb-1 text-xl font-semibold text-black dark:text-white">
                  {{ candidate.name }}
                </h3>
                <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  {{ candidate.nim }} - {{ candidate.faculty }}
                </p>
              </div>

              <!-- Vision & Mission -->
              <div class="mt-4 space-y-3 text-sm">
                <div v-if="candidate.vision">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">Visi:</h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ candidate.vision }}</p>
                </div>
                <div v-if="candidate.mission">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">Misi:</h4>
                  <p class="text-gray-600 dark:text-gray-400">{{ candidate.mission }}</p>
                </div>
              </div>

              <!-- Selection Indicator -->
              <div
                v-if="selectedCandidate === candidate.id"
                class="mt-4 flex items-center justify-center rounded-md bg-primary p-2 text-white"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-2 text-sm font-medium">Dipilih</span>
              </div>
            </div>
          </div>

          <!-- Vote Button -->
          <div v-if="selectedCandidate" class="mt-8 text-center">
            <button
              @click="submitVote"
              :disabled="submitting"
              class="inline-flex items-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">Sedang memproses...</span>
              <span v-else>Kirim Suara</span>
            </button>
          </div>
        </div>

        <!-- No Candidates -->
        <div v-else-if="!hasVoted && candidates.length === 0" class="py-12 text-center">
          <!-- <DataNotFound /> -->
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Belum ada kandidat tersedia untuk event ini
          </p>
        </div>

        <!-- Back Button -->
        <div class="mt-8 text-center">
          <button
            @click="$router.push({ name: 'events' })"
            class="inline-flex items-center rounded-md border border-stroke bg-gray-2 px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-3 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4/90"
          >
            ← Kembali ke Daftar Event
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
