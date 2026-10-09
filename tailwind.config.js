/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
            "on-secondary-fixed": 'var(--on-secondary-fixed)',
            "primary-fixed": 'var(--primary-fixed)',
            "surface-container-low": 'var(--surface-container-low)',
            "inverse-surface": 'var(--inverse-surface)',
            "on-secondary-container": 'var(--on-secondary-container)',
            "error": 'var(--error)',
            "primary-fixed-dim": 'var(--primary-fixed-dim)',
            "inverse-primary": 'var(--inverse-primary)',
            "secondary-fixed-dim": 'var(--secondary-fixed-dim)',
            "secondary-container": 'var(--secondary-container)',
            "on-tertiary-fixed": 'var(--on-tertiary-fixed)',
            "tertiary-fixed-dim": 'var(--tertiary-fixed-dim)',
            "surface-container-high": 'var(--surface-container-high)',
            "on-primary-fixed": 'var(--on-primary-fixed)',
            "on-primary-fixed-variant": 'var(--on-primary-fixed-variant)',

            "surface-container-highest": 'var(--surface-container-highest)',
            "outline": 'var(--outline)',
            "on-tertiary-fixed-variant": 'var(--on-tertiary-fixed-variant)',
            "surface-dim": 'var(--surface-dim)',
            "surface": 'var(--surface)',
            "on-primary": 'var(--on-primary)',
            "on-surface-variant": 'var(--on-surface-variant)',
            "on-tertiary-container": 'var(--on-tertiary-container)',
            "tertiary": 'var(--tertiary)',
            "on-primary-container": 'var(--on-primary-container)',
            "surface-container": 'var(--surface-container)',
            "outline-variant": 'var(--outline-variant)',
            "secondary-fixed": 'var(--secondary-fixed)',
            "on-secondary-fixed-variant": 'var(--on-secondary-fixed-variant)',
            "tertiary-fixed": 'var(--tertiary-fixed)',
            "tertiary-container": 'var(--tertiary-container)',
            "on-error-container": 'var(--on-error-container)',
            "on-secondary": 'var(--on-secondary)',
            "primary": {
              DEFAULT: 'var(--primary)',
              foreground: 'var(--on-primary)',
            },
            "secondary": {
              DEFAULT: 'var(--secondary)',
              foreground: 'var(--on-secondary)',
            },
            "on-background": 'var(--on-background)',
            "error-container": 'var(--error-container)',
            "primary-container": 'var(--primary-container)',
            "on-surface": 'var(--on-surface)',
            "inverse-on-surface": 'var(--inverse-on-surface)',
            "surface-variant": 'var(--surface-variant)',
            "surface-bright": 'var(--surface-bright)',
            "surface-tint": 'var(--surface-tint)',
            "on-tertiary": 'var(--on-tertiary)',
            "background": 'var(--background)',
            "on-error": 'var(--on-error)',
            "surface-container-lowest": 'var(--surface-container-lowest)',
            foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
        spacing: {
            "space-lg": "1.5rem",
            "space-sm": "0.5rem",
            "margin-lg": "3.5rem",
            "margin-md": "2rem",
            "margin": "1rem",
            "space-xs": "0.25rem",
            "gutter": "1rem",
            "space-xl": "2.5rem",
            "gutter-md": "1.5rem",
            "space-md": "1rem",
            "gutter-lg": "2rem"
        },
        fontFamily: {
            "body-lg": ["Inter", "sans-serif"],
            "title-md": ["Inter", "sans-serif"],
            "price-lg": ["Playfair Display", "serif"],
            "headline-lg-mobile": ["Playfair Display", "serif"],
            "body-sm": ["Inter", "sans-serif"],
            "label-sm": ["Inter", "sans-serif"],
            "headline-md": ["Playfair Display", "serif"],
            "title-lg": ["Playfair Display", "serif"],
            "headline-sm": ["Playfair Display", "serif"],
            "label-lg": ["Inter", "sans-serif"],
            "body-md": ["Inter", "sans-serif"],
            "display-lg": ["Playfair Display", "serif"],
            "headline-lg": ["Playfair Display", "serif"],
            "display-lg-mobile": ["Playfair Display", "serif"],
            "label-md": ["Inter", "sans-serif"]
        },
        fontSize: {
            "body-lg": ["16px", { "lineHeight": "26px", "fontWeight": "400" }],
            "title-md": ["16px", { "lineHeight": "22px", "fontWeight": "600" }],
            "price-lg": ["22px", { "lineHeight": "28px", "fontWeight": "700" }],
            "headline-lg-mobile": ["26px", { "lineHeight": "32px", "fontWeight": "600" }],
            "body-sm": ["12px", { "lineHeight": "18px", "fontWeight": "400" }],
            "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.06em", "fontWeight": "700" }],
            "headline-md": ["28px", { "lineHeight": "36px", "fontWeight": "600" }],
            "title-lg": ["18px", { "lineHeight": "24px", "fontWeight": "600" }],
            "headline-sm": ["22px", { "lineHeight": "28px", "fontWeight": "600" }],
            "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "600" }],
            "body-md": ["14px", { "lineHeight": "22px", "fontWeight": "400" }],
            "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
            "headline-lg": ["36px", { "lineHeight": "44px", "fontWeight": "600" }],
            "display-lg-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "0em", "fontWeight": "700" }],
            "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.04em", "fontWeight": "600" }]
        }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}