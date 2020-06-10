// vue.config.js
module.exports = {
  // options...
  publicPath: "/midirouter-online/",
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        linux: {
          category: "AudioVideo;Audio;"
        }
      }
    }
  }
}