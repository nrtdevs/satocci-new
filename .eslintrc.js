module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '.jsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-shadow': 'off',
        'no-undef': 'off',
        semi: 'off',
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto'
          }
        ]
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'react/no-unescaped-entities': 0,
    // Best Practices
    eqeqeq: 'error',
    'no-undef': 'error',
    'no-invalid-this': 'error',
    'no-return-assign': 'error',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    '@typescript-eslint/no-empty-function': 'off',

    // react
    'react/no-find-dom-node': 'off',
    'react/display-name': 'off',
    'no-prototype-builtins': 'off',
    // Variable
    // 'init-declarations': 'error',
    'no-use-before-define': 'error',
    // 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z]' }],

    // Stylistic Issues
    'array-bracket-newline': ['error', { multiline: true, minItems: null }],
    'array-bracket-spacing': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'block-spacing': 'error',
    'comma-dangle': 'error',
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'func-call-spacing': 'error',
    'implicit-arrow-linebreak': 'off',
    // indent: ['error', 4],
    'keyword-spacing': 'error',
    'multiline-ternary': 'off',
    // 'no-lonely-if': 'error',
    'no-mixed-operators': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'no-tabs': 'error',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    'quote-props': ['error', 'as-needed'],
    // quotes: ['error', 'prefer-single'],
    semi: ['error', 'never'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    // 'space-before-function-paren': 'error',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',

    // ES6
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',

    '@typescript-eslint/no-var-requires': 'off',
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }] //should add ".ts" if typescript project
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
}
