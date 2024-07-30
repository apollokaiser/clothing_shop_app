/* eslint-env node */
module.exports = {
  root: true,
  rules:{
    "no-unused-vars": [
      "off"
    ],
    "vue/multi-word-component-names":['off']
  },
  "vue/no-mutating-props": ["error", {
    "shallowOnly": true
  }],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',

  },
  
}
