import { defineConfig } from 'vite'
import { resolve } from 'path'

const BASE_HREF = '/'

// https://vitejs.dev/config/
// export default defineConfig(({ command, mode }) => {
export default defineConfig(({ mode }) => {
    return {
        base: BASE_HREF,
        resolve: {
            alias: {
                '@core': resolve(__dirname, 'src', 'core'),
                '@services': resolve(__dirname, 'src', 'services'),
                '@pages': resolve(__dirname, 'src', 'pages'),
            }
        },
        build: {
            /*
            lib: {
                entry: 'src/index.ts',
                formats: ['es']
            },
            */
            rollupOptions: {
                // input: resolve(__dirname, 'index.html'),
                // external: mode === "production" ? "" : /^lit/,
                output: {
                    manualChunks(id) {
                        if (id.includes('@vaadin')) {
                            return 'vaadin'
                        } else if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    }
                },
                external: mode === "production" ? "" : /^lit-element/,
            }
        },
        server: {
            hmr: {
                protocol: 'ws',
                port: 3000
            }
        }
    }
})
