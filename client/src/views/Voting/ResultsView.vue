<template>
  <DefaultLayout>
    <div class="mx-auto max-w-6xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingAnimation />
      </div>

      <div v-else>
        <!-- Event Header -->
        <div v-if="results" class="mb-8 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-title-lg font-semibold text-black dark:text-white">
                Hasil Pemilihan: {{ results.event_title }}
              </h1>
              <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Total Suara: <span class="font-semibold text-primary">{{ results.total_votes }}</span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">
                Last updated: {{ new Date().toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Results Grid -->
        <div v-if="results && results.results.length > 0" class="space-y-6">
          <div
            v-for="(result, index) in sortedResults"
            :key="result.candidate_id"
            class="rounded-lg border border-stroke bg-white p-6 shadow-default transition-all duration-200 hover:shadow-lg dark:border-strokedark dark:bg-boxdark"
          >
            <div class="flex items-center space-x-6">
              <!-- Rank Badge -->
              <div
                :class="{
                  'bg-yellow-500 text-white': index === 0,
                  'bg-gray-400 text-white': index === 1,
                  'bg-orange-600 text-white': index === 2,
                  'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': index > 2
                }"
                class="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
              >
                {{ index + 1 }}
              </div>

              <!-- Candidate Photo -->
              <div class="flex-shrink-0">
                <img
                  :src="result.candidate_photo || '/images/user/user-01.png'"
                  :alt="result.candidate_name"
                  class="h-16 w-16 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700"
                />
              </div>

              <!-- Candidate Info -->
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-black dark:text-white">
                  {{ result.candidate_name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ result.candidate_nim }} - {{ result.candidate_faculty }}
                </p>
              </div>

              <!-- Vote Stats -->
              <div class="flex-shrink-0 text-right">
                <div class="text-2xl font-bold text-primary">
                  {{ result.vote_count }}
                </div>
                <div class="text-sm text-gray-500">
                  suara
                </div>
              </div>

              <!-- Percentage -->
              <div class="flex-shrink-0 text-right">
                <div class="text-2xl font-bold text-black dark:text-white">
                  {{ result.percentage }}%
                </div>
                <div class="text-sm text-gray-500">
                  dari total
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  :style="{ width: `${result.percentage}%` }"
                  :class="{
                    'bg-yellow-500': index === 0,
                    'bg-gray-400': index === 1,
                    'bg-orange-600': index === 2,
                    'bg-primary': index > 2
                  }"
                  class="h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>

            <!-- Winner Badge -->
            <div v-if="index === 0 && results.total_votes > 0" class="mt-3 flex items-center justify-center">
              <span class="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                <svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Pemenang
              </span>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="results && results.results.length === 0" class="py-12 text-center">
          <DataNotFound />
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Belum ada suara untuk event ini
          </p>
        </div>

        <!-- Voting Statistics -->
        <div v-if="results && results.total_votes > 0" class="mt-8 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 class="mb-4 text-lg font-semibold text-black dark:text-white">
            Statistik Pemilihan
          </h3>
          
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary">{{ results.total_votes }}</div>
              <div class="text-sm text-gray-500">Total Suara</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ results.results.length }}</div>
              <div class="text-sm text-gray-500">Jumlah Kandidat</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">
                {{ results.results[0]?.percentage || 0 }}%
              </div>
              <div class="text-sm text-gray-500">Perolehan Tertinggi</div>
            </div>
          </div>
        </div>

        <!-- Real-time Update Notice -->
        <div class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <p class="ml-2 text-sm text-blue-700 dark:text-blue-300">
              Hasil ini diperbarui secara real-time. Refresh halaman untuk melihat hasil terbaru.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-center space-x-4">
          <button
            @click="refreshResults"
            :disabled="loading"
            class="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
            </svg>
            Refresh Hasil
          </button>

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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingAnimation from '@/components/common/LoadingAnimation.vue'
import DataNotFound from '@/components/common/DataNotFound.vue'
import useToast from '@/composables/useToast'
import API from '@/services/API'

interface CandidateResult {
  candidate_id: number
  candidate_name: string
  candidate_photo?: string
  candidate_nim?: string
  candidate_faculty?: string
  vote_count: number
  percentage: number
}

interface EventResults {
  event_id: number
  event_title: string
  total_votes: number
  results: CandidateResult[]
}

const route = useRoute()
const { showToast } = useToast()

const results = ref<EventResults | null>(null)
const loading = ref(true)

const eventId = computed(() => parseInt(route.params.eventId as string))

// Sort results by vote count (descending)
const sortedResults = computed(() => {
  if (!results.value?.results) return []
  return [...results.value.results].sort((a, b) => b.vote_count - a.vote_count)
})

const fetchResults = async () => {
  try {
    loading.value = true
    const response = await API().get(`/events/${eventId.value}/results`)
    results.value = response.data.data
  } catch (error: any) {
    console.error('Error fetching results:', error)
    showToast('Error loading results', 'error')
  } finally {
    loading.value = false
  }
}

const refreshResults = () => {
  fetchResults()
}

onMounted(() => {
  fetchResults()
})
</script>