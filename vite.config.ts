import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const alias = fs.readdirSync('./src', { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(file => ({
    find: file.name,
    replacement: path.resolve(__dirname, 'src', file.name)
  }))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  base: '/gerador-planilhas/'
})
