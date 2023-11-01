const {defineConfig} = require('eslint-define-config')

module.exports = defineConfig({
  extends: ['@compose/eslint-config', './.eslintrc-auto-import.json']
})
