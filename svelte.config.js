import content from '@originjs/vite-plugin-content';
import vercel from '@sveltejs/adapter-vercel';
import 'dotenv/config';
import fs from 'fs';
import preprocess from 'svelte-preprocess';
import svgSvelte from 'vite-plugin-svelte-svg';

const gtag = process.env.GTAG
  ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GTAG}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${process.env.GTAG}');
  </script>
`
  : '';

fs.writeFileSync(
  '.svelte-kit/app.html',
  fs
    .readFileSync('src/app.html', 'utf8')
    .toString()
    .replace(/%blurhash%/, () => fs.readFileSync('src/lib/vendor/blurhash-image.js', 'utf8'))
    .replace(/%gtag%/, () => gtag)
);

/** @type {import('@sveltejs/kit').Config} */
const conf = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    preprocess({
      scss: {
        prependData: "@import 'src/lib/util';",
      },
    }),
  ],
  onwarn: () => {},
  kit: {
    files: {
      template: '.svelte-kit/app.html',
    },
    adapter: vercel(),
    target: 'body',
    vite: {
      define: {
        'process.env.INDEX': JSON.stringify(process.env.INDEX),
      },
      plugins: [svgSvelte(), content.default()],
      optimizeDeps: {
        exclude: ['svelte-kit-cookie-session', 'mongodb', 'bson'],
      },
      resolve: {
        alias: {
          $vendor: process.cwd() + '/src/vendor',
        },
      },
    },
  },
};

export default conf;
