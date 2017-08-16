module.exports = function karmaConfig (config) {
  config.set({
    frameworks: [
      'jasmine'
    ],

    reporters: [
      'progress',
      'coverage'
    ],

    files: [
      'test/**/*.spec.js',
      'test/**/*.spec.ts',
    ],

    preprocessors: {
      'test/**/*.spec.js': ['webpack', 'sourcemap'],
      'test/**/*.spec.ts': ['webpack', 'sourcemap']
    },

    browsers: [
      'PhantomJS'
    ],

    singleRun: true,

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'text-summary'},
        {type: 'html'}
      ]
    },

    // Use the standard webpack configuration, but remove the CommonsChunkPlugin
    // (see https://github.com/webpack-contrib/karma-webpack/issues/22)
    webpack: function(config) {
        config.plugins = config.plugins.filter(p => p.constructor.name != 'CommonsChunkPlugin')
        return config;
    }(require('./webpack.config')),

    webpackMiddleware: {
      noInfo: 'errors-only'
    }
  });
};
