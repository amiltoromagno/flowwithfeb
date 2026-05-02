<template>
  <article class="min-h-screen bg-cream-100 dark:bg-night-900">
    <!-- Back nav -->
    <div class="fixed top-0 left-0 right-0 z-20 flex items-center px-4 sm:px-8 h-14 bg-cream-100/80 dark:bg-night-900/80 backdrop-blur-sm border-b border-ink-100 dark:border-night-600">
      <a href="/" class="inline-flex items-center gap-2 text-sm font-medium text-ink-400 dark:text-cream-300 hover:text-ink-900 dark:hover:text-cream-50 transition-colors duration-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        All posts
      </a>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-20 animate-pulse">
      <div class="h-10 w-3/4 rounded-lg bg-ink-100 dark:bg-night-700 mb-4" />
      <div class="h-4 w-32 rounded bg-ink-100 dark:bg-night-700 mb-8" />
      <div class="aspect-[16/9] rounded-2xl bg-ink-100 dark:bg-night-700 mb-10" />
      <div class="space-y-3">
        <div class="h-4 w-full rounded bg-ink-100 dark:bg-night-700" />
        <div class="h-4 w-full rounded bg-ink-100 dark:bg-night-700" />
        <div class="h-4 w-2/3 rounded bg-ink-100 dark:bg-night-700" />
      </div>
    </div>

    <!-- 404 -->
    <div v-else-if="!post" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <p class="font-serif text-ink-400 dark:text-cream-300 text-lg">Post not found.</p>
      <a href="/" class="text-sm text-terracotta-500 dark:text-ember-400 hover:text-terracotta-600 dark:hover:text-ember-300 underline">Back to home</a>
    </div>

    <!-- Post content -->
    <div v-else>
      <div class="max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <!-- Cover image -->
        <div v-if="post.coverImage" class="aspect-[16/9] rounded-xl overflow-hidden bg-ink-100 dark:bg-night-700 mb-8">
          <img
            :src="post.coverImage"
            :alt="post.coverAlt || post.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mb-5">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-terracotta-50 dark:bg-ember-600/20 text-terracotta-600 dark:text-ember-400 border border-terracotta-100 dark:border-ember-600/30 font-serif"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-cream-50 tracking-tight leading-tight mb-4">
          {{ post.title }}
        </h1>

        <!-- Date -->
        <div class="flex items-center gap-3 mb-10 pb-8 border-b border-ink-100 dark:border-night-600">
          <time :datetime="post.publishedAt" class="font-serif text-sm text-ink-300 dark:text-cream-300 tracking-wide uppercase">
            {{ formattedDate }}
          </time>
        </div>

        <!-- Excerpt (if no cover image shown above) -->
        <p v-if="post.excerpt && !post.coverImage" class="font-serif text-xl text-ink-500 dark:text-cream-300/70 leading-relaxed mb-10 italic">
          {{ post.excerpt }}
        </p>

        <!-- Markdown body -->
        <div
          class="prose prose-blog dark:prose-blog-dark max-w-none"
          v-html="renderedBody"
        ></div>

        <!-- Footer -->
        <div class="mt-16 pt-8 border-t border-ink-100 dark:border-night-600">
          <a href="/" class="inline-flex items-center gap-2 text-sm font-medium text-ink-400 dark:text-cream-300 hover:text-terracotta-500 dark:hover:text-ember-400 transition-colors duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Post } from '~/types/blog'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const fetch = useRequestFetch()

const { data: post, pending } = await useLazyAsyncData<Post | null>(`post-${slug.value}`, () =>
  fetch(`/api/posts/${slug.value}`).catch(() => null)
)

useHead(() => ({
  title: post.value ? `${post.value.title} — Flow with Feb` : 'Loading…',
  meta: post.value?.excerpt
    ? [{ name: 'description', content: post.value.excerpt }]
    : [],
}))

const { render } = useMarkdown()

const renderedBody = computed(() =>
  post.value?.body ? render(post.value.body) : ''
)

const formattedDate = computed(() =>
  post.value
    ? new Date(post.value.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''
)
</script>
