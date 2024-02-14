const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
    extends: ["@compose/eslint-config", "./imports-eslint.json"],
});
