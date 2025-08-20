<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Dashboard
        </h2>
      </div>

      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Welcome Card -->
        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <i class="fa-solid fa-home text-primary"></i>
          </div>
          <div class="mt-4 flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                Welcome to Dashboard
              </h4>
              <span class="text-sm font-medium">Starter template with authentication</span>
            </div>
          </div>
        </div>

        <!-- Users Card -->
        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <i class="fa-solid fa-users text-primary"></i>
          </div>
          <div class="mt-4 flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                User Management
              </h4>
              <span class="text-sm font-medium">Manage users and roles</span>
            </div>
          </div>
        </div>

        <!-- Settings Card -->
        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <i class="fa-solid fa-cog text-primary"></i>
          </div>
          <div class="mt-4 flex items-end justify-between">
            <div>
              <h4 class="text-title-md font-bold text-black dark:text-white">
                Configuration
              </h4>
              <span class="text-sm font-medium">System settings and preferences</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Content Area -->
      <div class="mt-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">
          Getting Started
        </h3>
        <div class="space-y-4">
          <p class="text-body">
            This is a clean starter template with authentication functionality. You can now build upon this foundation by adding your own features and components.
          </p>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded border border-stroke p-4 dark:border-strokedark">
              <h4 class="mb-2 font-semibold text-black dark:text-white">
                Authentication Ready
              </h4>
              <p class="text-sm text-body">
                Login, registration, password reset functionality is already implemented and ready to use.
              </p>
            </div>
            <div class="rounded border border-stroke p-4 dark:border-strokedark">
              <h4 class="mb-2 font-semibold text-black dark:text-white">
                Dashboard Template
              </h4>
              <p class="text-sm text-body">
                Clean dashboard layout with sidebar navigation, header, and responsive design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>