<template>
  <article class="group flex flex-col gap-4">
    <!-- Cover image -->
    <a :href="`/posts/${post.slug}`" class="block overflow-hidden rounded-xl aspect-[16/9] bg-cream-200 dark:bg-night-700">
      <img
        v-if="post.coverImage"
        :src="post.coverImage"
        :alt="post.coverAlt || post.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-10 h-10 text-ink-300 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </a>

    <!-- Meta -->
    <div class="flex flex-col gap-2">
      <!-- Tags -->
      <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="text-xs font-medium px-2 py-0.5 rounded-full bg-terracotta-50 dark:bg-ember-600/20 text-terracotta-600 dark:text-ember-400 border border-terracotta-100 dark:border-ember-600/30"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Date -->
      <time :datetime="post.publishedAt" class="text-xs font-medium tracking-wider uppercase text-ink-300 dark:text-cream-300 font-serif">
        {{ formattedDate }}
      </time>

      <!-- Title -->
      <a :href="`/posts/${post.slug}`">
        <h2 class="font-serif font-semibold text-xl leading-tight text-ink-900 dark:text-cream-50 group-hover:text-terracotta-500 dark:group-hover:text-ember-400 transition-colors duration-200">
          {{ post.title }}
        </h2>
      </a>

      <!-- Excerpt -->
      <p v-if="post.excerpt" class="font-serif text-ink-500 dark:text-cream-300/70 text-base leading-relaxed line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Read more -->
      <a
        :href="`/posts/${post.slug}`"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 dark:text-ember-400 hover:text-terracotta-600 dark:hover:text-ember-300 transition-colors duration-200 mt-1 w-fit"
      >
        Read more
        <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PostSummary } from '~/types/blog'

const props = defineProps<{
  post: PostSummary
}>()

const formattedDate = computed(() =>
  new Date(props.post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
)
</script>
