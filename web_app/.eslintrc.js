module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    tsconfigRootDir: __dirname,
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true,
      "tsx": true
    },
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "env": {
    "browser": true
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "extends": [
    "airbnb-typescript"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "ignorePatterns": [
    "*.js",
    "*.d.ts"
  ],
  "rules": {
    "@typescript-eslint/semi": [
      "error",
      "never"
    ],
    "no-multi-spaces": [
      "error",
      {
        "ignoreEOLComments": false
      }
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 2,
        "maxEOF": 0
      }
    ],
    "react/prop-types": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "react/display-name": 0,
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "indent": [
      "error",
      2
    ],
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/no-empty-function": 0,
    "import/no-extraneous-dependencies": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "no-nested-ternary": 0,
    "react/state-in-constructor": [
      2,
      "never"
    ],
    "max-len": [
      "error",
      {
        "code": 140,
        "tabWidth": 2
      }
    ]
  },
  "settings": {
    "settings": {
      "import/resolver": {
        "typescript": {} // this loads <rootdir>/tsconfig.json to eslint
      }
    },
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx"
      ]
    }
  }
}