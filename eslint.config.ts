// .eslintrc.js
export const parser = '@typescript-eslint/parser';

export const parserOptions = {
  ecmaFeatures: { jsx: true },
  ecmaVersion: 2020,
  sourceType: 'module',
};

export const eslintExtends = [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:@typescript-eslint/recommended',
];

export const plugins = ['react', '@typescript-eslint'];

export const rules = {
  quotes: ['error', 'single'],
};

export const settings = {
  react: { version: 'detect' },
};
