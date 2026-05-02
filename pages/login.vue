<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-cream-100 dark:bg-night-900">
    <div class="w-full max-w-sm">
      <!-- Logo / title -->
      <div class="text-center mb-10">
        <img src="/bb.png" class="w-32 h-32 object-cover mx-auto mb-5" alt="Flow with Feb" />
        <h1 class="font-serif text-2xl font-semibold text-ink-900 dark:text-cream-50 tracking-tight">Welcome back</h1>
        <p class="font-serif text-sm text-ink-400 dark:text-cream-300 mt-1.5">Enter your password to continue</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-serif text-sm font-medium text-ink-700 dark:text-cream-200">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :disabled="loading"
            class="w-full px-4 py-3 rounded-xl border border-ink-100 dark:border-night-600 bg-white dark:bg-night-800 font-serif text-sm text-ink-900 dark:text-cream-100 placeholder-ink-300 dark:placeholder-night-500
                   focus:outline-none focus:ring-2 focus:ring-terracotta-300 dark:focus:ring-ember-500 focus:border-terracotta-400 dark:focus:border-ember-500
                   disabled:opacity-60 transition-all duration-200"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="font-serif text-sm text-red-500 dark:text-red-400 text-center -mt-1">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading || !password"
          class="w-full py-3 px-4 rounded-xl bg-terracotta-500 dark:bg-ember-500 hover:bg-terracotta-600 dark:hover:bg-ember-600 active:bg-terracotta-700 dark:active:bg-ember-600
                 text-white font-serif font-medium text-sm tracking-wide
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-300 dark:focus:ring-ember-400 focus:ring-offset-2 dark:focus:ring-offset-night-900"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Signing in…
          </span>
          <span v-else>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function handleLogin() {
  if (!password.value) return
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { password: password.value },
    })
    await router.push('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Incorrect password'
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>
