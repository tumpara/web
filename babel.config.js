module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'formatjs',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        removeDefaultMessage: process.env.BABEL_ENV !== 'development',
        ast: true,
      },
    ],
  ],
};
