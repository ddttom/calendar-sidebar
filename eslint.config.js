const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    {
        ignores: ["eslint.config.js"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.webextensions,
            }
        },
        rules: {
        }
    }
];
