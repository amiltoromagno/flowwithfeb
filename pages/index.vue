<template>
  <!-- Layout: sidebar + main feed -->
  <div class="flex min-h-screen">
    <!-- Fixed sidebar — desktop only -->
    <aside class="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-56 xl:w-64 border-r border-ink-100 dark:border-night-600 bg-white/70 dark:bg-night-800/70 backdrop-blur-sm z-30">
      <!-- Blog name / nav -->
      <div class="px-5 pt-6 pb-4 border-b border-ink-100 dark:border-night-600 flex items-center gap-3">
        <img src="/bb.png" class="w-8 h-8 object-cover flex-shrink-0" alt="Flow with Feb" />
        <span class="font-serif font-semibold text-base text-ink-900 dark:text-cream-50 tracking-tight">Flow with Feb</span>
      </div>

      <!-- Nav links -->
      <nav class="px-3 py-3 border-b border-ink-100 dark:border-night-600">
        <a href="/studio"
           class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-all duration-150">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Studio
        </a>
        <button @click="logout"
           class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-all duration-150">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>

        <!-- Dark mode toggle -->
        <button @click="toggle"
           class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-all duration-150">
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {{ isDark ? 'Light mode' : 'Dark mode' }}
        </button>
      </nav>

      <!-- Timeline -->
      <TimelineSidebar
        :timeline="timeline"
        :active-key="activeMonthKey"
        @navigate="handleTimelineNav"
        class="flex-1 overflow-hidden"
      />
    </aside>

    <!-- Mobile top bar -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-night-800/80 backdrop-blur-sm border-b border-ink-100 dark:border-night-600 flex items-center px-4 h-14">
      <div class="flex items-center gap-2.5 flex-1">
        <img src="/bb.png" class="w-7 h-7 object-cover" alt="Flow with Feb" />
        <span class="font-serif font-semibold text-sm text-ink-900 dark:text-cream-50">Flow with Feb</span>
      </div>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-night-700 transition-colors" aria-label="Toggle menu">
        <svg class="w-5 h-5 text-ink-700 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-4"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-40 flex">
        <div class="w-64 bg-white dark:bg-night-800 flex flex-col shadow-2xl">
          <div class="px-4 pt-5 pb-3 border-b border-ink-100 dark:border-night-600 flex items-center justify-between">
            <span class="font-serif font-semibold text-base text-ink-900 dark:text-cream-50">Archive</span>
            <button @click="mobileMenuOpen = false" class="p-1.5 rounded-lg hover:bg-cream-100 dark:hover:bg-night-700">
              <svg class="w-4 h-4 text-ink-500 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="px-3 py-3 border-b border-ink-100 dark:border-night-600 space-y-1">
            <a href="/studio"
               @click="mobileMenuOpen = false"
               class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-all duration-150">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Studio
            </a>
            <button @click="toggle"
               class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-all duration-150">
              <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              {{ isDark ? 'Light mode' : 'Dark mode' }}
            </button>
          </nav>
          <TimelineSidebar
            :timeline="timeline"
            :active-key="activeMonthKey"
            @navigate="(item) => { handleTimelineNav(item); mobileMenuOpen = false }"
            class="flex-1 overflow-hidden"
          />
        </div>
        <div class="flex-1 bg-ink-900/40 dark:bg-black/60" @click="mobileMenuOpen = false" />
      </div>
    </Transition>

    <!-- Main content area -->
    <main class="flex-1 lg:ml-56 xl:ml-64 min-h-screen">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 pt-24 lg:pt-16 pb-20">

        <!-- Page heading -->
        <header class="mb-12">
          <h1 class="font-serif text-4xl font-semibold text-ink-900 dark:text-cream-50 tracking-tight">
            Posts
          </h1>
          <p class="font-serif text-ink-400 dark:text-cream-300 mt-2 text-lg">
            My thoughts, notes, and observations.
          </p>
          <div class="mt-4 h-px bg-gradient-to-r from-terracotta-200 dark:from-ember-600 via-ink-100 dark:via-night-600 to-transparent" />
        </header>

        <!-- Loading state -->
        <div v-if="pending" class="flex flex-col gap-12">
          <div v-for="i in 3" :key="i" class="animate-pulse flex flex-col gap-4">
            <div class="aspect-[16/9] rounded-xl bg-ink-100 dark:bg-night-700" />
            <div class="h-4 w-24 rounded bg-ink-100 dark:bg-night-700" />
            <div class="h-7 w-3/4 rounded bg-ink-100 dark:bg-night-700" />
            <div class="h-4 w-full rounded bg-ink-100 dark:bg-night-700" />
            <div class="h-4 w-2/3 rounded bg-ink-100 dark:bg-night-700" />
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-20">
          <p class="font-serif text-ink-400 dark:text-cream-300">Couldn't load posts.</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!posts?.length" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream-200 dark:bg-night-700 mb-4">
            <svg class="w-7 h-7 text-ink-300 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 class="font-serif text-lg font-semibold text-ink-700 dark:text-cream-200 mb-1">No posts yet</h2>
          <p class="font-serif text-ink-400 dark:text-cream-300 text-sm">Head over to Studio to write your first post.</p>
          <a href="/studio" class="inline-block mt-4 px-4 py-2 rounded-lg bg-terracotta-500 dark:bg-ember-500 text-white text-sm font-medium hover:bg-terracotta-600 dark:hover:bg-ember-600 transition-colors">
            Open Studio →
          </a>
        </div>

        <!-- Feed -->
        <div v-else class="flex flex-col gap-16">
          <template v-for="(group, gi) in groupedPosts" :key="gi">
            <!-- Month anchor heading -->
            <div
              :id="`month-${group.year}-${group.month}`"
              class="flex items-center gap-3 -mb-8"
            >
              <span class="font-serif text-xs font-bold tracking-widest uppercase text-ink-300 dark:text-cream-300">
                {{ group.label }}
              </span>
              <div class="flex-1 h-px bg-ink-100 dark:bg-night-600" />
            </div>

            <!-- Posts in this month -->
            <article v-for="post in group.posts" :key="post.slug">
              <PostCard :post="post" />
            </article>
          </template>

          <!-- From-date notice -->
          <div v-if="fromDate" class="text-center py-4 border-t border-ink-100 dark:border-night-600">
            <p class="font-serif text-xs text-ink-300 dark:text-cream-300">
              Showing posts from {{ fromLabel }} onwards.
              <button @click="resetFeed" class="underline text-terracotta-500 dark:text-ember-400 hover:text-terracotta-600 dark:hover:text-ember-300 ml-1">Show all</button>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { buildTimeline, usePosts, type PostSummary, type TimelineMonth } from '~/composables/usePosts'

useHead({ title: 'Flow with Feb' })

const route = useRoute()
const router = useRouter()
const { isDark, toggle } = useColorMode()

const mobileMenuOpen = ref(false)
const fromDate = computed(() => route.query.from as string | undefined)
const fromLabel = computed(() => {
  if (!fromDate.value) return ''
  const [year, month] = fromDate.value.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const { data: postsData, pending, error } = await (fromDate.value
  ? usePosts().fetchPostsFrom(fromDate.value)
  : usePosts().fetchPosts())

const posts = computed(() => postsData.value ?? [])

const { data: timelineRaw } = await usePosts().fetchTimeline()

const timeline = computed(() => buildTimeline(timelineRaw.value ?? []))

const groupedPosts = computed(() => {
  const groups: { year: number; month: number; label: string; posts: PostSummary[] }[] = []
  for (const post of posts.value) {
    const d = new Date(post.publishedAt)
    const y = d.getFullYear()
    const m = d.getMonth()
    let g = groups.find((g) => g.year === y && g.month === m)
    if (!g) {
      g = {
        year: y,
        month: m,
        label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        posts: [],
      }
      groups.push(g)
    }
    g.posts.push(post)
  }
  return groups
})

const activeMonthKey = ref('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id
          const parts = id.replace('month-', '').split('-')
          activeMonthKey.value = `${parts[0]}-${parts[1]}`
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  )

  const observe = () => {
    document.querySelectorAll('[id^="month-"]').forEach((el) => observer.observe(el))
  }

  observe()
  watch(groupedPosts, async () => {
    await nextTick()
    observe()
  })

  onUnmounted(() => observer.disconnect())
})

async function handleTimelineNav(item: TimelineMonth) {
  const anchorId = `month-${item.year}-${item.month}`
  const el = document.getElementById(anchorId)

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeMonthKey.value = `${item.year}-${item.month}`
  } else {
    const monthStr = String(item.month + 1).padStart(2, '0')
    await router.push({ query: { from: `${item.year}-${monthStr}` } })
    await nextTick()
    await new Promise((r) => setTimeout(r, 200))
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function resetFeed() {
  router.push({ query: {} })
}

async function logout() {
  await $fetch('/api/logout', { method: 'POST' })
  await navigateTo('/login')
}
</script>
