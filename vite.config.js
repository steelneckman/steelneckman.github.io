import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Since the repo is named steelneckman.github.io, the site will be hosted at the root path '/'.
  // If this was a sub-project (e.g. steelneckman.github.io/portfolio), base would be '/portfolio/'
  base: '/',
  plugins: [react()],
})
