import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // 순수 함수 테스트는 네트워크/DOM이 필요 없어 node 환경으로 충분
    environment: 'node',
  },
})
