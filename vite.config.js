import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '// vite.config.js
export default {
  base: '/Cineflex/',  // Usa el nombre de tu repositorio aquí
};
',
})

