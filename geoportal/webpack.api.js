const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const destDir = '/etc/static-ngeo/';

const babelPresets = [
  [
    require.resolve('@babel/preset-env'),
    {
      targets: 'defaults, > 0.1% in CH, > 0.1% in FR, Firefox ESR and supports es6-class and not iOS < 10',
      modules: false,
      loose: true,
    },
  ],
];

module.exports = (env, argv) => {
  const library = argv.library ? argv.library : 'geomapfish';
  return {
    entry: path.resolve(__dirname, 'geomapfish_geoportal/static-ngeo/api/index.js'),
    devtool: 'source-map',
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets,
              babelrc: false,
              comments: false,
              plugins: [
                require.resolve('babel-plugin-angularjs-annotate'),
                require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
                require.resolve('@babel/plugin-proposal-optional-chaining'),
              ],
            },
          },
        },
      ],
    },
    output: {
      filename: 'api.js',
      path: destDir,
      libraryTarget: 'umd',
      globalObject: 'this',
      libraryExport: 'default',
      library: library,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            compress: false,
          },
        }),
      ],
    },
    resolve: {
      modules: [
        '/usr/lib/node_modules',
        '/usr/lib/node_modules/ol/node_modules',
        '/usr/lib/node_modules/proj4/node_modules',
      ],
      alias: {
        api: '/usr/lib/node_modules/ngeo/api/src',
        ngeo: '/usr/lib/node_modules/ngeo/src',
      },
    },
    resolveLoader: {
      modules: ['/usr/lib/node_modules'],
    },
  };
};
