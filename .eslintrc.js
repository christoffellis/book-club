// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
