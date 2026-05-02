# Flow with Feb

A minimal, fullstack blog built with [Nuxt 3](https://nuxt.com). Features a password-protected Studio for writing and managing posts with a rich text editor.

## Setup

```bash
npm install
```

Create a `.env` file:

```env
NUXT_SESSION_PASSWORD=<a random 32+ char secret>
BLOG_PASSWORD_HASH=<bcrypt hash of your password>
```

Generate a password hash:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(h => console.log(h))"
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
```

Set `NUXT_SESSION_PASSWORD` and `BLOG_PASSWORD_HASH` as environment variables on your host, then:

```bash
node .output/server/index.mjs
```

## Tech

- **Nuxt 3** — fullstack framework
- **TipTap** — rich text editor (Studio)
- **Tailwind CSS** — styling with dark mode
- **nuxt-auth-utils** — password authentication
- **markdown-it** — post rendering
- **gray-matter** — frontmatter parsing
