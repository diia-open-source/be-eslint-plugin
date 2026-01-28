import { describe, it } from 'vitest'
import { Linter, RuleTester } from 'eslint'
import * as jsoncParser from 'jsonc-eslint-parser'

import rule, { messageId, ruleName } from '../../src/rules/noServiceWordInPackageJsonNameField'

const filename = 'package.json'
const ruleTester = new RuleTester()

const languageOptions: Linter.LanguageOptions = {
    parser: jsoncParser,
}

describe(ruleName, () => {
    it(ruleName, () => {
        ruleTester.run(ruleName, rule, {
            valid: [
                {
                    filename,
                    languageOptions,
                    code: '{ "name": "test-app" }',
                },
                {
                    filename,
                    languageOptions,
                    code: '{ "name": "my-app", "description": "test service" }',
                },
                {
                    filename: 'src/config.ts',
                    code: 'const config = { "name": "test-service-config" };',
                },
                {
                    filename,
                    languageOptions,
                    code: '{ "name": 123 }',
                },
            ],
            invalid: [
                {
                    filename,
                    languageOptions,
                    code: '{ "name": "test-service" }',
                    errors: [{ messageId }],
                },
                {
                    filename,
                    languageOptions,
                    code: '{ "name": "service-test" }',
                    errors: [{ messageId }],
                },
                {
                    filename,
                    languageOptions,
                    code: '{ "name": "my-service-app" }',
                    errors: [{ messageId }],
                },
                {
                    filename,
                    languageOptions,
                    code: `
                {
                    "version": "1.0.0",
                    "description": "test",
                    "name": "test-service" 
                }
            `,
                    errors: [{ messageId }],
                },
            ],
        })
    })
})
