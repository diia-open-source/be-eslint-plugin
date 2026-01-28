// @ts-check
import js from '@eslint/js'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import pluginPrettier from 'eslint-plugin-prettier'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pluginImport from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.mjs', '.prettierrc.js'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    pluginImport.flatConfigs.recommended,
    prettierConfig,
    {
        files: ['**/*.{ts,mts}'],
        languageOptions: {
            parserOptions: {
                project: ['tsconfig.json', 'tests/tsconfig.json'],
                ecmaVersion: 2022,
                sourceType: `module`,
            },
        },
        plugins: {
            prettier: pluginPrettier,
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            'import/no-unresolved': 'off',
            'import/order': ['error'],
        },
    },
)
