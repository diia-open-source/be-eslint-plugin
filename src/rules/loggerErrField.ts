/* eslint-disable @typescript-eslint/no-explicit-any */
import { simpleTraverse as traverse } from '@typescript-eslint/typescript-estree'
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { createRule } from '../utils'

const ruleName = 'err-field'

const loggerKeyword = 'logger'
const errorKeyword = 'err'

function isLoggerCall(callExpressionNode: TSESTree.Node): boolean {
    let result = false

    traverse(callExpressionNode, {
        enter: (node) => {
            if (!result && node.type === AST_NODE_TYPES.MemberExpression) {
                if (
                    node.object.type === AST_NODE_TYPES.ThisExpression &&
                    node.property.type === AST_NODE_TYPES.Identifier &&
                    node.property.name === loggerKeyword
                ) {
                    result = true
                }
            }
        },
    })

    return result
}

function isObjectContainWrongErrorParam(variableDeclarator: TSESTree.Node, catchErrorParamName: string): boolean {
    if (variableDeclarator.type === AST_NODE_TYPES.Property && variableDeclarator.value.type === AST_NODE_TYPES.Identifier) {
        const { value, key } = variableDeclarator

        if (value.name === catchErrorParamName && 'name' in key && key.name !== errorKeyword) {
            return true
        }
    }

    return false
}

function getLoggerArgs(catchNode: TSESTree.BaseNode): TSESTree.Node[] {
    let result: TSESTree.Node[] = []

    traverse(<any>catchNode, {
        enter: (node) => {
            if (node.type !== AST_NODE_TYPES.CallExpression) {
                return
            }

            if (!isLoggerCall(node)) {
                return
            }

            result = node.arguments
        },
    })

    return result
}

const rule = createRule({
    create(context) {
        return {
            CatchClause(catchNode): void {
                if (catchNode.param === null || catchNode.param.type !== AST_NODE_TYPES.Identifier) {
                    return
                }

                const catchErrorParamName = catchNode.param.name

                const loggerArgs = getLoggerArgs(catchNode)

                loggerArgs.forEach((arg) => {
                    if (arg.type === AST_NODE_TYPES.Identifier) {
                        if (arg.name === catchErrorParamName) {
                            context.report({
                                messageId: ruleName,
                                node: arg,
                            })

                            return
                        }

                        traverse(<any>catchNode, {
                            enter: (c) => {
                                if (
                                    c.type === AST_NODE_TYPES.VariableDeclarator &&
                                    c.id.type === AST_NODE_TYPES.Identifier &&
                                    c.id.name === arg.name
                                ) {
                                    traverse(c, {
                                        enter: (variableNode) => {
                                            if (isObjectContainWrongErrorParam(variableNode, catchErrorParamName)) {
                                                context.report({
                                                    messageId: ruleName,
                                                    node: variableNode,
                                                })
                                            }
                                        },
                                    })
                                }
                            },
                        })

                        return
                    }

                    if (arg.type === AST_NODE_TYPES.ObjectExpression) {
                        traverse(<any>arg, {
                            enter: (objectNode) => {
                                if (isObjectContainWrongErrorParam(objectNode, catchErrorParamName)) {
                                    context.report({
                                        messageId: ruleName,
                                        node: objectNode,
                                    })
                                }
                            },
                        })
                    }
                })
            },
        }
    },
    name: 'logger-err-field',
    meta: {
        docs: {
            description: 'Error must be logged only in the object with [err] field. For example: <{err: e}>',
        },
        messages: {
            'err-field': 'Error must be logged only in the object with [err] field. For example: <{err: e}>',
        },
        type: 'problem',
        schema: [],
    },
    defaultOptions: [],
})

export default rule
