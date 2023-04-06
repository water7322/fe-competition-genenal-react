import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const BASE_MAP: Record<string, any> = {
    development: '/',
    test: 'https://static.nowcoder.com/fe/file/site/competition/pc/develop/',
    pre: 'https://static.nowcoder.com/fe/file/site/competition/pc/pre/',
    production: 'https://static.nowcoder.com/fe/file/site/competition/pc/prod/'
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        base: BASE_MAP[mode],
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@@': path.resolve(__dirname, '..', 'common')
            }
        },
        server: {
            proxy: {
                '^/api-local': {
                    target: 'https://d.nowcoder.com',
                    rewrite: (path) => path.replace(/^\/api-local/, ''),
                    changeOrigin: true,
                    cookieDomainRewrite: {
                        '*': 'localhost'
                    },
                    headers: { Referer: 'https://d.nowcoder.com', Authorization: 'Basic bm93Y29kZXI6bm93Y29kZXIxMjM=' }
                },
                '^/hr-api-local': {
                    target: 'https://dhr.nowcoder.com',
                    rewrite: (path) => path.replace(/^\/hr-api-local/, ''),
                    changeOrigin: true,
                    cookieDomainRewrite: {
                        '*': 'localhost'
                    },
                    headers: {
                        Referer: 'https://dhr.nowcoder.com',
                        Authorization: 'Basic bm93Y29kZXI6bm93Y29kZXIxMjM='
                    }
                },
                '^/ac-api-local': {
                    target: 'https://dac.nowcoder.com',
                    rewrite: (path) => path.replace(/^\/ac-api-local/, ''),
                    changeOrigin: true,
                    cookieDomainRewrite: {
                        '*': 'localhost'
                    },
                    headers: {
                        Referer: 'https://dac.nowcoder.com',
                        Authorization: 'Basic bm93Y29kZXI6bm93Y29kZXIxMjM='
                    }
                },
                '^/m-api-local': {
                    target: 'https://md.nowcoder.com',
                    rewrite: (path) => path.replace(/^\/m-api-local/, ''),
                    changeOrigin: true,
                    cookieDomainRewrite: {
                        '*': 'localhost'
                    },
                    headers: { Referer: 'https://md.nowcoder.com', Authorization: 'Basic bm93Y29kZXI6bm93Y29kZXIxMjM=' }
                }
            }
        }
    };
});
