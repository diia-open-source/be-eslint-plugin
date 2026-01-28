import * as path from 'node:path'
import type { Rule } from 'eslint'
import type { AST } from 'jsonc-eslint-parser'

const fieldName = 'name'
const forbiddenWord = 'service'
export const messageId = 'containsServiceWord'
const packageJSONFileName = 'package.json'
export const ruleName = 'no-service-word-in-package-json-name-field'

const rule = {
    name: ruleName,
    defaultOptions: [],
    meta: {
        type: 'problem' as const,
        docs: {
            description: "Ensure package.json 'name' field does not contain 'service'",
        },
        messages: {
            [messageId]: "The 'name' field in package.json must not contain the word 'service'.",
        },
        schema: [],
    },
    create(context: Rule.RuleContext) {
        if (!path.basename(context.filename).startsWith(packageJSONFileName)) {
            return {}
        }

        return {
            JSONProperty(node: AST.JSONProperty) {
                const keyNode = node.key as AST.JSONIdentifier | AST.JSONLiteral
                const key = keyNode.type === 'JSONIdentifier' ? keyNode.name : keyNode.value

                if (key === fieldName) {
                    if (node.value.type === 'JSONLiteral') {
                        const value = node.value.value

                        if (typeof value === 'string' && value.includes(forbiddenWord)) {
                            context.report({
                                messageId,
                                node: node.value as unknown as Rule.Node,
                            })
                        }
                    }
                }
            },
        }
    },
}

export default rule
