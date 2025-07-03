import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // Habilita modo oscuro por clase
    theme: {
        extend: {
            fontSize: {
              'xxs': '0.625rem',  
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                'color-background': 'var(--color-background)',
                'color-foreground': 'var(--color-foreground)',
                'border-color': 'var(--border-color)',
                'electric-blue': 'var(--electric-blue)',
                'cyber-gray': 'var(--cyber-gray)',
                'soft-white': 'var(--soft-white)',
                'accent-pink': 'var(--accent-pink)',
                'menu-hover-bg': 'var(--menu-hover-bg)',
                'hover-foreground': 'var(--hover-foreground)',
            },
        },
    },
    plugins: [],
};

export default config;
