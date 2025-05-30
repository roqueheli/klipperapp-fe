import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // 👈 Habilita modo oscuro por clase
    theme: {
        extend: {
            colors: {
                // Agregamos una referencia a la variable CSS para color primario
                primary: 'var(--primary)',
                // Otros colores personalizados si los necesitás:
                // lightBg: '#f8f9fa',
                // darkBg: '#212529',
            },
        },
    },
    plugins: [],
};

export default config;
