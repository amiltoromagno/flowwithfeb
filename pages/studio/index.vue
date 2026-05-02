<template>
  <ClientOnly>
    <div class="flex h-screen bg-cream-100 dark:bg-night-900">
      <!-- Sidebar: Post list -->
      <aside class="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-56 xl:w-64 flex-shrink-0 border-r border-ink-100 dark:border-night-600 bg-white/50 dark:bg-night-800/50 z-30">
        <div class="px-4 py-4 border-b border-ink-100 dark:border-night-600 flex items-center justify-between">
          <span class="font-serif font-semibold text-sm text-ink-900 dark:text-cream-50">Studio</span>
          <a href="/" class="text-xs text-ink-400 dark:text-night-500 hover:text-ink-900 dark:hover:text-cream-50 transition-colors">&larr; Flow with Feb</a>
        </div>
        <button
          @click="newPost"
          class="mx-3 mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-terracotta-500 dark:bg-ember-500 text-white hover:bg-terracotta-600 dark:hover:bg-ember-600 transition-colors"
        >
          + New Post
        </button>
        <nav class="flex-1 overflow-y-auto py-2 px-3">
          <div v-if="postListPending" class="text-xs text-ink-400 dark:text-night-500 px-2 py-4">Loading…</div>
          <template v-else>
            <button
              v-for="p in postList"
              :key="p.slug"
              @click="editPost(p.slug)"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                editingSlug === p.slug
                  ? 'bg-terracotta-50 dark:bg-ember-600/15 text-terracotta-600 dark:text-ember-400'
                  : 'text-ink-700 dark:text-cream-300/80 hover:bg-cream-100 dark:hover:bg-night-700'
              ]"
            >
              <div class="font-medium truncate">{{ p.title || 'Untitled' }}</div>
              <div class="text-xs text-ink-400 dark:text-night-500 mt-0.5">{{ formatDate(p.publishedAt) }}</div>
            </button>
            <div v-if="!postListPending && postList.length === 0" class="text-xs text-ink-400 dark:text-night-500 px-2 py-4">
              No posts yet.
            </div>
          </template>
        </nav>
        <!-- Sign out -->
        <div class="px-3 py-3 border-t border-ink-100 dark:border-night-600">
          <button @click="logout" class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-ink-400 dark:text-night-500 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      <!-- Mobile top bar -->
      <div class="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-night-800/80 backdrop-blur-sm border-b border-ink-100 dark:border-night-600 flex items-center px-4 h-14">
        <div class="flex items-center gap-2.5 flex-1">
          <div class="w-7 h-7 rounded-lg bg-terracotta-500 dark:bg-ember-500 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span class="font-serif font-semibold text-sm text-ink-900 dark:text-cream-50">Studio</span>
        </div>
        <a href="/" class="text-xs text-ink-400 dark:text-night-500 mr-2">&larr; Flow with Feb</a>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-night-700 transition-colors" aria-label="Toggle posts">
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
            <div class="px-4 py-4 border-b border-ink-100 dark:border-night-600 flex items-center justify-between">
              <span class="font-serif font-semibold text-sm text-ink-900 dark:text-cream-50">Posts</span>
              <button @click="mobileMenuOpen = false" class="p-1.5 rounded-lg hover:bg-cream-100 dark:hover:bg-night-700">
                <svg class="w-4 h-4 text-ink-500 dark:text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              @click="newPost(); mobileMenuOpen = false"
              class="mx-3 mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-terracotta-500 dark:bg-ember-500 text-white hover:bg-terracotta-600 dark:hover:bg-ember-600 transition-colors"
            >
              + New Post
            </button>
            <nav class="flex-1 overflow-y-auto py-2 px-3">
              <div v-if="postListPending" class="text-xs text-ink-400 dark:text-night-500 px-2 py-4">Loading…</div>
              <template v-else>
                <button
                  v-for="p in postList"
                  :key="p.slug"
                  @click="editPost(p.slug); mobileMenuOpen = false"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                    editingSlug === p.slug
                      ? 'bg-terracotta-50 dark:bg-ember-600/15 text-terracotta-600 dark:text-ember-400'
                      : 'text-ink-700 dark:text-cream-300/80 hover:bg-cream-100 dark:hover:bg-night-700'
                  ]"
                >
                  <div class="font-medium truncate">{{ p.title || 'Untitled' }}</div>
                  <div class="text-xs text-ink-400 dark:text-night-500 mt-0.5">{{ formatDate(p.publishedAt) }}</div>
                </button>
                <div v-if="!postListPending && postList.length === 0" class="text-xs text-ink-400 dark:text-night-500 px-2 py-4">
                  No posts yet.
                </div>
              </template>
            </nav>
            <div class="px-3 py-3 border-t border-ink-100 dark:border-night-600">
              <button @click="logout" class="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-ink-400 dark:text-night-500 hover:text-ink-900 dark:hover:text-cream-50 hover:bg-cream-100 dark:hover:bg-night-700 transition-colors">
                Sign out
              </button>
            </div>
          </div>
          <div class="flex-1 bg-ink-900/40 dark:bg-black/60" @click="mobileMenuOpen = false" />
        </div>
      </Transition>

      <!-- Editor area -->
      <main class="flex-1 overflow-y-auto pt-14 lg:pt-0 lg:ml-56 xl:ml-64">
        <template v-if="!editingSlug && !isNew">
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-14 h-14 rounded-2xl bg-cream-200 dark:bg-night-700 mx-auto mb-4 flex items-center justify-center">
                <svg class="w-7 h-7 text-ink-300 dark:text-night-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p class="font-serif text-ink-400 dark:text-night-500 text-sm">Select a post or create a new one.</p>
            </div>
          </div>
        </template>

        <div v-else class="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">
          <!-- Loading existing post -->
          <div v-if="editingSlug && postPending" class="animate-pulse space-y-4 py-8">
            <div class="h-8 w-1/2 bg-ink-100 dark:bg-night-700 rounded" />
            <div class="h-10 w-3/4 bg-ink-100 dark:bg-night-700 rounded" />
            <div class="h-40 bg-ink-100 dark:bg-night-700 rounded-xl" />
          </div>

          <form v-else @submit.prevent="save" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Title</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 rounded-lg text-lg font-serif font-semibold bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                placeholder="Post title"
                @input="onTitleChange"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 font-mono placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                placeholder="my-post-slug"
              />
            </div>

            <!-- Published date -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Published At</label>
              <input
                v-model="form.publishedAt"
                type="datetime-local"
                class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
              />
            </div>

            <!-- Cover image -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Cover Image</label>
              <div class="flex items-start gap-3">
                <div class="flex-1 space-y-2">
                  <input
                    v-model="form.coverImage"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                    placeholder="/images/my-cover.jpg (or upload below)"
                  />
                  <input
                    v-model="form.coverAlt"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                    placeholder="Alt text"
                  />
                  <input
                    v-model="form.coverCaption"
                    type="text"
                    class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                    placeholder="Caption (optional)"
                  />
                </div>
                <label class="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium bg-cream-200 dark:bg-night-700 text-ink-700 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-night-600 cursor-pointer transition-colors">
                  Upload
                  <input type="file" accept="image/*" class="hidden" @change="uploadCover" />
                </label>
              </div>
              <img v-if="form.coverImage" :src="form.coverImage" class="mt-3 rounded-lg max-h-40 object-cover" />
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Tags</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, i) in form.tags"
                  :key="i"
                  class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-terracotta-50 dark:bg-ember-600/20 text-terracotta-600 dark:text-ember-400 border border-terracotta-100 dark:border-ember-600/30"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(i)" class="text-terracotta-400 dark:text-ember-500 hover:text-terracotta-600">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="tagInput"
                  type="text"
                  class="flex-1 px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500"
                  placeholder="Add tag"
                  @keydown.enter.prevent="addTag"
                  @keydown.,="addTag"
                />
                <button type="button" @click="addTag" class="px-3 py-2 rounded-lg text-xs font-medium bg-cream-200 dark:bg-night-700 text-ink-700 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-night-600 transition-colors">Add</button>
              </div>
            </div>

            <!-- Excerpt -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Excerpt</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                class="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-night-800 border border-ink-100 dark:border-night-600 text-ink-900 dark:text-cream-50 placeholder:text-ink-300 dark:placeholder:text-night-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400 dark:focus:ring-ember-500 resize-none"
                placeholder="Short summary (max 200 chars)"
                maxlength="200"
              ></textarea>
            </div>

            <!-- Tiptap body editor -->
            <div>
              <label class="block text-xs font-semibold tracking-wider uppercase text-ink-400 dark:text-night-500 mb-1.5">Body</label>
              <div class="border border-ink-100 dark:border-night-600 rounded-xl overflow-hidden bg-white dark:bg-night-800">
                <div v-if="editor" class="flex flex-wrap gap-0.5 px-2 py-2 border-b border-ink-100 dark:border-night-600 bg-cream-50 dark:bg-night-900">
                  <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="toolbarBtn(editor.isActive('bold'))" title="Bold">B</button>
                  <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="toolbarBtn(editor.isActive('italic'))" title="Italic"><i>I</i></button>
                  <button type="button" @click="editor.chain().focus().toggleCode().run()" :class="toolbarBtn(editor.isActive('code'))" title="Inline code">&lt;/&gt;</button>
                  <span class="w-px h-6 bg-ink-200 dark:bg-night-600 self-center mx-0.5" />
                  <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="toolbarBtn(editor.isActive('heading', { level: 2 }))" title="H2">H2</button>
                  <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="toolbarBtn(editor.isActive('heading', { level: 3 }))" title="H3">H3</button>
                  <span class="w-px h-6 bg-ink-200 dark:bg-night-600 self-center mx-0.5" />
                  <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="toolbarBtn(editor.isActive('bulletList'))" title="Bullet list">&bull; List</button>
                  <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="toolbarBtn(editor.isActive('orderedList'))" title="Numbered list">1. List</button>
                  <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="toolbarBtn(editor.isActive('blockquote'))" title="Blockquote">&ldquo;</button>
                  <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="toolbarBtn(editor.isActive('codeBlock'))" title="Code block">&lt;Code&gt;</button>
                  <span class="w-px h-6 bg-ink-200 dark:bg-night-600 self-center mx-0.5" />
                  <button type="button" @click="addLink" :class="toolbarBtn(editor.isActive('link'))" title="Link">🔗</button>
                  <button type="button" @click="addImage" class="px-2 py-1 text-xs font-medium rounded hover:bg-cream-200 dark:hover:bg-night-700 transition-colors text-ink-600 dark:text-cream-300" title="Image">🖼</button>
                  <span class="w-px h-6 bg-ink-200 dark:bg-night-600 self-center mx-0.5" />
                  <button type="button" @click="editor.chain().focus().undo().run()" class="px-2 py-1 text-xs font-medium rounded hover:bg-cream-200 dark:hover:bg-night-700 transition-colors text-ink-600 dark:text-cream-300" title="Undo">↩</button>
                  <button type="button" @click="editor.chain().focus().redo().run()" class="px-2 py-1 text-xs font-medium rounded hover:bg-cream-200 dark:hover:bg-night-700 transition-colors text-ink-600 dark:text-cream-300" title="Redo">↪</button>
                </div>
                <EditorContent :editor="editor" class="px-4 py-3 min-h-[400px] prose prose-blog dark:prose-blog-dark max-w-none" />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="submit"
                :disabled="saving"
                class="px-5 py-2.5 rounded-lg text-sm font-medium bg-terracotta-500 dark:bg-ember-500 text-white hover:bg-terracotta-600 dark:hover:bg-ember-600 disabled:opacity-50 transition-colors"
              >
                {{ saving ? 'Saving…' : 'Save' }}
              </button>
              <button
                v-if="editingSlug"
                type="button"
                @click="deletePost"
                :disabled="saving"
                class="px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Delete
              </button>
              <button type="button" @click="cancel" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-400 dark:text-night-500 hover:text-ink-900 dark:hover:text-cream-50 transition-colors">
                Cancel
              </button>
            </div>
            <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
            <p v-if="saveSuccess" class="text-sm text-green-600 dark:text-green-400">{{ saveSuccess }}</p>
          </form>
        </div>
      </main>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'

definePageMeta({ ssr: false })

const form = reactive({
  slug: '',
  title: '',
  publishedAt: '',
  coverImage: '',
  coverAlt: '',
  coverCaption: '',
  tags: [] as string[],
  excerpt: '',
})

const tagInput = ref('')
const mobileMenuOpen = ref(false)
const editingSlug = ref<string | null>(null)
const isNew = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const editor = shallowRef<Editor | null>(null)

const { data: postListData, pending: postListPending, refresh: refreshList } = await useLazyAsyncData('studio-posts', () =>
  $fetch('/api/posts')
)
const postList = computed(() => postListData.value ?? [])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function resetForm() {
  form.slug = ''
  form.title = ''
  form.publishedAt = new Date().toISOString().slice(0, 16)
  form.coverImage = ''
  form.coverAlt = ''
  form.coverCaption = ''
  form.tags = []
  form.excerpt = ''
  tagInput.value = ''
  saveError.value = ''
  saveSuccess.value = ''
}

function onTitleChange() {
  if (!editingSlug.value) {
    form.slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 96)
  }
}

function addTag() {
  const tag = tagInput.value.trim().replace(/,/g, '')
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(i: number) {
  form.tags.splice(i, 1)
}

async function uploadCover(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  const result = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: fd })
  form.coverImage = result.url
  target.value = ''
}

function initEditor(content: string) {
  destroyEditor()
  editor.value = new Editor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  })
}

function destroyEditor() {
  editor.value?.destroy()
  editor.value = null
}

function toolbarBtn(active: boolean) {
  return `px-2 py-1 text-xs font-medium rounded transition-colors ${
    active
      ? 'bg-terracotta-100 dark:bg-ember-600/30 text-terracotta-700 dark:text-ember-400'
      : 'text-ink-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-night-700'
  }`
}

function addLink() {
  if (!editor.value) return
  const url = window.prompt('URL:')
  if (url) {
    editor.value.chain().focus().setLink({ href: url, target: '_blank' }).run()
  }
}

async function addImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file || !editor.value) return
    const fd = new FormData()
    fd.append('file', file)
    const result = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: fd })
    editor.value.chain().focus().setImage({ src: result.url }).run()
  }
  input.click()
}

function newPost() {
  editingSlug.value = null
  isNew.value = true
  resetForm()
  nextTick(() => initEditor(''))
}

async function editPost(slug: string) {
  editingSlug.value = slug
  isNew.value = false
  resetForm()
  const post = await $fetch(`/api/posts/${slug}`)
  form.slug = post.slug
  form.title = post.title
  form.publishedAt = post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''
  form.coverImage = post.coverImage || ''
  form.coverAlt = post.coverAlt || ''
  form.coverCaption = post.coverCaption || ''
  form.tags = post.tags || []
  form.excerpt = post.excerpt || ''
  nextTick(() => initEditor(post.body || ''))
}

function cancel() {
  editingSlug.value = null
  isNew.value = false
  destroyEditor()
  saveError.value = ''
  saveSuccess.value = ''
}

async function save() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''

  const body = editor.value?.getHTML() || ''
  const data: any = {
    slug: form.slug,
    title: form.title,
    publishedAt: form.publishedAt || new Date().toISOString(),
    coverImage: form.coverImage || undefined,
    coverAlt: form.coverAlt || undefined,
    coverCaption: form.coverCaption || undefined,
    tags: form.tags,
    excerpt: form.excerpt || undefined,
    body,
  }

  try {
    if (isNew.value || !editingSlug.value) {
      await $fetch('/api/posts', { method: 'POST', body: data })
      editingSlug.value = form.slug
      isNew.value = false
    } else {
      await $fetch(`/api/posts/${editingSlug.value}`, { method: 'PUT', body: data })
    }
    saveSuccess.value = 'Saved!'
    setTimeout(() => { saveSuccess.value = '' }, 2000)
    refreshList()
  } catch (e: any) {
    saveError.value = e?.data?.statusMessage || e?.message || 'Save failed'
  } finally {
    saving.value = false
  }
}

async function deletePost() {
  if (!editingSlug.value || !confirm('Delete this post?')) return
  saving.value = true
  try {
    await $fetch(`/api/posts/${editingSlug.value}`, { method: 'DELETE' })
    destroyEditor()
    editingSlug.value = null
    isNew.value = false
    refreshList()
  } catch (e: any) {
    saveError.value = e?.data?.statusMessage || e?.message || 'Delete failed'
  } finally {
    saving.value = false
  }
}

async function logout() {
  await $fetch('/api/logout', { method: 'POST' })
  await navigateTo('/login')
}

onUnmounted(() => {
  destroyEditor()
})
</script>

<style>
.ProseMirror {
  min-height: 400px;
}
.ProseMirror:focus {
  outline: none;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--tw-prose-captions);
  pointer-events: none;
  height: 0;
}
.ProseMirror pre {
  background: #1a1a1a;
  color: #fdfcfa;
  border-radius: 0.75rem;
  padding: 1.25rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.625;
}
.ProseMirror pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
}
.ProseMirror img {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 2rem 0;
}
.ProseMirror blockquote {
  border-left: 3px solid #efa78c;
  padding-left: 1rem;
  font-style: italic;
  color: var(--tw-prose-quotes);
}
.dark .ProseMirror blockquote {
  border-left-color: #d4893a;
}
</style>
