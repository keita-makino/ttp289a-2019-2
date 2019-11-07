/* eslint-disable @typescript-eslint/no-var-requires */
const { getBabelLoader } = require('customize-cra');
const hotLoader = require('react-app-rewire-hot-loader');
const math = require('remark-math');
const katex = require('rehype-katex');

module.exports = (config, env) => {
  const babelLoader = getBabelLoader(config);
  config.module.rules.map(rule => {
    if (typeof rule.test !== 'undefined' || typeof rule.oneOf === 'undefined') {
      return rule;
    }

    rule.oneOf.unshift({
      test: /\.mdx?$/,
      use: [
        {
          loader: babelLoader.loader,
          options: babelLoader.options
        },
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [math],
            rehypePlugins: [[katex, { fleqn: true }]]
          }
        }
      ]
    });

    return rule;
  });

  config = hotLoader(config, env);
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom'
  };
  return config;
};
