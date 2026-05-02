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

During local dev, posts and images are stored on the filesystem (`content/posts/`, `public/images/`).

## Deploy to Cloudflare Pages

This project uses **Cloudflare D1** for post storage and **Cloudflare R2** for image uploads (both free tier).

### 1. Create D1 database

```bash
npx wrangler d1 create blog-db
```

Copy the `database_id` from the output into `wrangler.toml` (replace `REPLACE_WITH_YOUR_D1_DATABASE_ID`).

Run the schema:

```bash
npx wrangler d1 execute blog-db --file=./database/schema.sql
```

### 2. Create R2 bucket

```bash
npx wrangler r2 bucket create blog-images
```

### 3. Set environment variables in Cloudflare

Go to your Cloudflare Pages project → Settings → Environment variables, and add:

```
NUXT_SESSION_PASSWORD=<your random 32+ char secret>
BLOG_PASSWORD_HASH=<your bcrypt password hash>
```

### 4. Deploy

```bash
npm run build
npx wrangler pages deploy .output/public --branch main
```

Or connect your GitHub repo to Cloudflare Pages for automatic deploys (set the build command to `npm run build` and output directory to `dist/`).

### Migrating existing posts

If you have posts in `content/posts/` from local dev, use the D1 CLI to insert them:

```bash
npx wrangler d1 execute blog-db --command="INSERT INTO posts (slug, title, published_at, tags, body) VALUES ('test', 'Test', '2026-04-30T03:24', '[\"test\"]', '<p>Hello world</p>')"
```

## Tech

- **Nuxt 3** — fullstack framework
- **Cloudflare D1** — serverless SQLite (production)
- **Cloudflare R2** — image storage (production)
- **TipTap** — rich text editor
- **Tailwind CSS** — styling with dark mode
- **nuxt-auth-utils** — password authentication
- **markdown-it** — post rendering
