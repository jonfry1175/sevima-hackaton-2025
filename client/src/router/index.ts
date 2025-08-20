import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AuthView from '@/views/Authentication/AuthView.vue'
import ForgotPasswordView from '@/views/Authentication/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/Authentication/ResetPasswordView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: AuthView,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: AuthView,
    meta: {
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: ForgotPasswordView,
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: '/users/reset-password/:token',
    name: 'resetPassword',
    component: ResetPasswordView,
    meta: {
      title: 'Reset Password'
    },
    beforeEnter: (to, from, next) => {
      const token = to.params.token
      if (token) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // Set document title berdasarkan meta.title
  document.title = `${to.meta.title} | Dashboard`

  const userData = localStorage.getItem('user') // Ambil userData dari localStorage

  // Temukan route root (routes[0]) dan semua children-nya
  const dashboardRoute = routes.find((route) => route.name === 'dashboard')

  const protectedRouteName = dashboardRoute
    ? [dashboardRoute.name, ...(dashboardRoute.children?.map((child) => child.name) || [])]
    : []

  const authRouteName = ['login', 'register', 'forgotPassword']

  // Cek apakah route yang dituju termasuk dalam protectedRouteName
  if (to.name && protectedRouteName.includes(to.name) && !userData) {
    // Jika tidak ada userData, redirect ke login
    return next({ name: 'login' }) // Redirect ke login jika tidak ada userData
  }

  // Cek apakah route yang dituju termasuk dalam authRouteName
  if (to.name && authRouteName.includes(to.name as string) && userData) {
    // Jika ada userData, redirect ke dashboard
    return next({ name: 'dashboard' }) // Redirect ke dashboard jika ada userData
  }

  next()
})
export default router
