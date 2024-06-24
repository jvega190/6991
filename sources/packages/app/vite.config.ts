import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [react()],
    base: command === 'serve' ? '/' : '/static-assets/app',
    server: {
      open: true,
      port: 3000,
      cors: true,
      host: true
    },
    build: {
      sourcemap: 'inline',
      emptyOutDir: true,
      outDir: '../../../static-assets/app',
      minify: true
    }
  };
});
