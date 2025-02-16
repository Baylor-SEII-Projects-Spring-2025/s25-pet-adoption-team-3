import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,jsx}"] },
    {
        languageOptions: {
            ecmaVersion: "latest", // ✅ Supports modern JavaScript
            sourceType: "module", // ✅ Required for ES module syntax
            globals: {
                ...globals.browser, // ✅ Includes browser globals (window, document, etc.)
                ...globals.node, // ✅ Includes Node.js globals (process, __dirname, etc.)
            },
        },
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
];
