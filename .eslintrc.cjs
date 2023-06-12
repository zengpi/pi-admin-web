/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  overrides: [
    {
      files: ["cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "vue/custom-event-name-casing": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-reserved-component-names": "off",
    "no-undef": "off",
    "no-unsafe-optional-chaining": "off",
    "@typescript-eslint/no-unused-vars": [
      0,
      {
        argsIgnorePattern: "^h$",
        varsIgnorePattern: "^h$",
      },
    ],
    "no-unused-vars": [
      0,
      {
        argsIgnorePattern: "^h$",
        varsIgnorePattern: "^h$",
      },
    ],
    "space-before-function-paren": "off",
    quotes: [0, "single"],
    "comma-dangle": [0, "never"],
  },
};
