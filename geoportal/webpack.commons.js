const commons = require('ngeo/buildtools/webpack.commons.js');

const config = commons({
  DllReferencePluginOptions: {
    context: '/usr/lib/',
  },
  noTs: true,
  nodll: true,
});

// Remove magic-comments-loader rule to avoid ESM/CJS incompatibility with oxc-parser
config.module.rules = config.module.rules.filter(
  (rule) =>
    !Array.isArray(rule.use) ||
    !rule.use.some(
      (use) => use && typeof use.loader === 'string' && use.loader.includes('magic-comments-loader'),
    ),
);

module.exports = () => config;
