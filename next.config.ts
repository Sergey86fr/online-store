import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              // По умолчанию svgo вырезает viewBox, и иконка не масштабируется
              // при изменении размера через CSS (w-8 h-8 и т.п.) — рисунок съезжает
              svgoConfig: {
                plugins: [
                  { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
                  'prefixIds',
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
