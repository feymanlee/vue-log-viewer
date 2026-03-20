import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  worker: {
    format: 'es'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueLogViewer',
      formats: ['es', 'umd'],
      fileName: (format) => `vue-log-viewer.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      external: ['vue', 'pinia', '@vueuse/core', 'lodash-es'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          '@vueuse/core': 'VueUse',
          'lodash-es': '_'
        }
      }
    }
  }
})
