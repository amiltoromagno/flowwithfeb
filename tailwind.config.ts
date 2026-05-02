import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf3f0',
          100: '#fae4dc',
          200: '#f6cab8',
          300: '#efa78c',
          400: '#e57d5e',
          500: '#c1694f',
          600: '#a8543e',
          700: '#8c4234',
          800: '#72352b',
          900: '#5e2d25',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f4f0e8',
          300: '#ede5d8',
        },
        ink: {
          900: '#1a1a1a',
          700: '#3d3d3d',
          500: '#6b6b6b',
          300: '#a3a3a3',
          100: '#e5e5e5',
        },
        // Cozy dark mode palette — warm espresso/charcoal tones
        night: {
          950: '#131110',  // deepest background
          900: '#1c1917',  // main background
          800: '#262220',  // card/sidebar background
          700: '#33302c',  // elevated surfaces
          600: '#44403a',  // borders
          500: '#57534a',  // muted elements
        },
        ember: {
          // Warm amber tint for dark mode accents (complements terracotta)
          50:  '#fefaf5',
          100: '#fdf0dd',
          200: '#fad9a8',
          300: '#f5bf70',
          400: '#e6a24b',
          500: '#d4893a',
          600: '#b5702e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      typography: (theme: (path: string) => string) => ({
        blog: {
          css: {
            '--tw-prose-body': theme('colors.ink.900'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-links': theme('colors.terracotta.500'),
            '--tw-prose-bold': theme('colors.ink.900'),
            '--tw-prose-counters': theme('colors.terracotta.500'),
            '--tw-prose-bullets': theme('colors.terracotta.400'),
            '--tw-prose-hr': theme('colors.ink.100'),
            '--tw-prose-quotes': theme('colors.ink.700'),
            '--tw-prose-quote-borders': theme('colors.terracotta.300'),
            '--tw-prose-captions': theme('colors.ink.500'),
            '--tw-prose-code': theme('colors.ink.900'),
            '--tw-prose-pre-code': theme('colors.cream.50'),
            '--tw-prose-pre-bg': theme('colors.ink.900'),
            fontFamily: theme('fontFamily.serif'),
            fontSize: '1.125rem',
            lineHeight: '1.85',
            maxWidth: 'none',
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            a: {
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.terracotta.300')}`,
              transition: 'border-color 0.2s, color 0.2s',
              '&:hover': {
                color: theme('colors.terracotta.600'),
                borderBottomColor: theme('colors.terracotta.600'),
              },
            },
            blockquote: {
              fontStyle: 'italic',
              fontWeight: '400',
            },
            strong: {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '600',
            },
            b: {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '600',
            },
            code: {
              fontFamily: 'monospace',
              fontSize: '0.9em',
              backgroundColor: theme('colors.cream.200'),
              borderRadius: '0.25rem',
              padding: '0.1em 0.35em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
        // Dark mode prose overrides
        'blog-dark': {
          css: {
            '--tw-prose-body': theme('colors.cream.200'),
            '--tw-prose-headings': theme('colors.cream.50'),
            '--tw-prose-links': theme('colors.ember.400'),
            '--tw-prose-bold': theme('colors.cream.100'),
            '--tw-prose-counters': theme('colors.ember.400'),
            '--tw-prose-bullets': theme('colors.ember.500'),
            '--tw-prose-hr': theme('colors.night.600'),
            '--tw-prose-quotes': theme('colors.cream.300'),
            '--tw-prose-quote-borders': theme('colors.ember.500'),
            '--tw-prose-captions': theme('colors.night.500'),
            '--tw-prose-code': theme('colors.cream.100'),
            '--tw-prose-pre-code': theme('colors.cream.200'),
            '--tw-prose-pre-bg': theme('colors.night.950'),
            code: {
              backgroundColor: theme('colors.night.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config

