import { defineConfig } from 'vite'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
  ?? process.env.VITE_REPOSITORY_NAME
  ?? 'nav'

export default defineConfig({
  base: `/${repository}/`,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
