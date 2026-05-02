import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})

md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
  const src = token.attrGet('src') || ''
  const alt = token.content || ''
  const title = token.attrGet('title')

  const img = `<img src="${md.utils.escapeHtml(src)}" alt="${md.utils.escapeHtml(alt)}" class="w-full rounded-xl shadow-sm" loading="lazy" />`

  if (title) {
    return `<figure class="my-8 not-prose">${img}<figcaption class="text-center text-sm text-ink-400 dark:text-night-500 mt-3 font-serif">${md.utils.escapeHtml(title)}</figcaption></figure>`
  }

  return `<figure class="my-8 not-prose">${img}</figure>`
}

const defaultFence = md.renderer.rules.fence!
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const classes = 'my-6 p-5 rounded-xl bg-ink-900 dark:bg-night-950 overflow-x-auto not-prose'
  const codeClass = 'text-cream-100 dark:text-cream-200 text-sm font-mono leading-relaxed'

  const lang = token.info ? ` data-lang="${md.utils.escapeHtml(token.info)}"` : ''
  const code = `<code class="${codeClass}">${md.utils.escapeHtml(token.content)}</code>`
  return `<pre class="${classes}"${lang}>${code}</pre>`
}

export function useMarkdown() {
  const render = (content: string) => md.render(content)
  return { render }
}
