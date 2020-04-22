export default {
  mode: "spa",
  head: {
    title: "Human Resources Information System",
  },
  modules: ["@nuxtjs/style-resources"],
  styleResources: {
    scss: ["~assets/styles/_variables.scss"],
  },
  css: [
    "~assets/styles/normalize.css",
    "@/assets/styles/element-ui.scss",
    "@fortawesome/fontawesome-free/css/all.css",
    "~assets/styles/global.scss",
  ],
  plugins: [
    "@/plugins/storage.js",
    "@/plugins/db.js",
    "@/plugins/element.js",
    "@/plugins/filters.js",
  ],
  build: {
    extend: config => {
      config.target = "electron-renderer"
      config.module.rules.push({
        test: /\.(xls|xlsx)$/,
        loaders: ["arraybuffer-loader"],
      })
    },
  },
}
