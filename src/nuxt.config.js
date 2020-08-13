module.exports = {
  /*
  ** Headers of the page
  */
  vue: {
    devtools: true
  },
  // mode: 'spa',
  head: {
    title: 'manage-application',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'manage-application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: "https://vjs.zencdn.net/7.5.5/video-js.css", rel: "stylesheet"},
      { href: "https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js" }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  buildDir: '../functions/nuxt',
  build: {
    publicPath: '/assets/',
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            configFile: '.eslintrc.js'
          }
        })
      }
    }
  },
  css: [
    '@/assets/css/bulma.scss'
  ],
  plugins: [
    '~/plugins/firebase',
    { src: '~/plugins/localStorage.js', ssr: false },
    '~/plugins/day.js'
  ],
  router: {
  },
  rules: [
    {
      test: /\.js$/,
      loader: 'babel',
      query: {
          compact: false
      }
    }
  ],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/toast'
  ],
  toast: {
    position: 'top-right',
    duration: 2000
  },
  manifest: {
    name: 'manage-application',
    lang: 'ja'
  }
}
