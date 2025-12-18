/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                },
                slate: {
                    850: '#151e2e',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
