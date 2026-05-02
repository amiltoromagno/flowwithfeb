<template>
  <aside class="timeline-sidebar flex flex-col h-full">
    <!-- Header -->
    <div class="px-5 pt-5 pb-3 border-b border-ink-100 dark:border-night-600">
      <h3 class="font-serif text-xs font-semibold tracking-widest uppercase text-ink-300 dark:text-cream-300">Archive</h3>
    </div>

    <!-- Timeline list -->
    <nav class="flex-1 overflow-y-auto py-2 px-3 scrollbar-hide" aria-label="Post archive timeline">
      <template v-for="(group, gi) in groupedTimeline" :key="gi">
        <!-- Year heading -->
        <div class="px-2 py-2 mt-3 first:mt-1">
          <span class="font-serif text-xs font-bold tracking-wider text-ink-400 dark:text-cream-300/60 uppercase">{{ group.year }}</span>
        </div>

        <!-- Months -->
        <ul class="space-y-0.5">
          <li v-for="item in group.months" :key="`${item.year}-${item.month}`">
            <button
              v-if="item.hasPosts"
              :id="`timeline-${item.year}-${item.month}`"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-all duration-200 group/item',
                activeKey === `${item.year}-${item.month}`
                  ? 'bg-terracotta-50 dark:bg-ember-600/15 text-terracotta-600 dark:text-ember-400'
                  : 'text-ink-700 dark:text-cream-300/80 hover:bg-cream-100 dark:hover:bg-night-700 hover:text-ink-900 dark:hover:text-cream-50'
              ]"
              @click="handleMonthClick(item)"
            >
              <!-- Dot indicator -->
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200',
                  activeKey === `${item.year}-${item.month}`
                    ? 'bg-terracotta-500 dark:bg-ember-400'
                    : 'bg-ink-200 dark:bg-night-600 group-hover/item:bg-terracotta-300 dark:group-hover/item:bg-ember-500'
                ]"
              />
              <span class="font-serif text-sm font-medium truncate">
                {{ monthName(item.month) }}
              </span>
              <span class="ml-auto font-serif text-xs text-ink-300 dark:text-cream-300 flex-shrink-0">{{ item.posts.length }}</span>
            </button>

            <!-- Empty month — greyed out with tooltip -->
            <div
              v-else
              :title="`No posts in ${item.label}`"
              class="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 cursor-default select-none opacity-35"
              aria-disabled="true"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-ink-200 dark:bg-night-600 flex-shrink-0" />
              <span class="font-serif text-sm text-ink-400 dark:text-cream-300 truncate">{{ monthName(item.month) }}</span>
            </div>
          </li>
        </ul>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { TimelineMonth } from '~/composables/usePosts'

const props = defineProps<{
  timeline: TimelineMonth[]
  activeKey?: string
}>()

const emit = defineEmits<{
  navigate: [item: TimelineMonth]
}>()

// Group by year
const groupedTimeline = computed(() => {
  const years: { year: number; months: TimelineMonth[] }[] = []
  for (const item of props.timeline) {
    let group = years.find((g) => g.year === item.year)
    if (!group) {
      group = { year: item.year, months: [] }
      years.push(group)
    }
    group.months.push(item)
  }
  return years
})

const monthName = (month: number) =>
  new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' })

const handleMonthClick = (item: TimelineMonth) => {
  emit('navigate', item)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
