const path = require('path');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          '@babel/preset-react'
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          'react-hot-loader/babel'
        ]
      }
    }
  });

  config.module.rules = config.module.rules.filter(
    f => f.test.toString() !== '/\\.css$/'
  );

  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      }
    ],
    include: path.resolve(__dirname, '../')
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
