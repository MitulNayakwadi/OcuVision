import type { Config } from 'tailwindcss';

/**
 * OcuVision — "Clinical Futurism" design system.
 * Every colour, radius, spacing step and font in the product comes from here.
 * If a value is not in this file it does not belong in a className.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F9F9F8',
        vitality: {
          DEFAULT: '#FF5A3C',
          ink: '#B5250C', // accent text on light surfaces (contrast-safe)
          soft: '#FFE9E3',
        },
        copper: {
          DEFAULT: '#B87A4B',
          soft: '#F2E3D6',
        },
        charcoal: {
          DEFAULT: '#1A1C1C',
          soft: '#3A3E3E', // neutral chart series / secondary fills
        },
        slate: {
          warm: '#5B403B',
          cool: '#6B7076',
          hair: 'rgba(26,28,28,0.08)',
        },
        danger: '#BA1A1A',
        advisory: {
          routine: '#1F7A4C',
          watch: '#A66A00',
          urgent: '#BA1A1A',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['11px', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        'label-sm': ['12px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        card: '24px',
        panel: '32px',
        chip: '999px',
      },
      spacing: {
        gutter: '24px',
        container: '40px',
        'card-gap': '32px',
        section: '120px',
      },
      maxWidth: {
        container: '1440px',
        prose: '68ch',
      },
      backdropBlur: {
        glass: '24px',
      },
      backgroundImage: {
        chrome: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #c8c8c8 100%)',
        'chrome-ring':
          'conic-gradient(from 210deg, #c8c8c8, #f7f7f7, #d4d4d4, #ffffff, #bdbdbd, #f0f0f0, #c8c8c8)',
        'copper-sheen':
          'linear-gradient(135deg, #B87A4B 0%, #E8C4A0 45%, #8F5A33 100%)',
        shimmer:
          'linear-gradient(100deg, #FF5A3C 0%, #FF5A3C 35%, #FFFFFF 50%, #FF5A3C 65%, #FF5A3C 100%)',
        'iris-fibre':
          'repeating-conic-gradient(from 0deg, rgba(184,122,75,0.9) 0deg 1.2deg, rgba(255,255,255,0.15) 1.2deg 2.6deg)',
      },
      transitionTimingFunction: {
        clinical: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-100% 50%' },
        },
        'chrome-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.06)', opacity: '0.85' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-track': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.4s linear infinite',
        'chrome-spin': 'chrome-spin 2.4s linear infinite',
        'chrome-spin-slow': 'chrome-spin 9s linear infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-track': 'pulse-track 2s ease-in-out infinite',
      },
      zIndex: {
        headline: '1',
        canvas: '2',
        surface: '10',
        header: '50',
        overlay: '90',
        modal: '100',
      },
    },
  },
  plugins: [],
} satisfies Config;
