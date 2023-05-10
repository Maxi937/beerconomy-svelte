import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/ always was a comment
export default defineConfig({
  plugins: [svelte()],
})



