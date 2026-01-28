import { ESLintUtils } from '@typescript-eslint/utils'

const docLink = `https://gitlab.diia.org.ua/diia-inhouse/eslint-plugin#`

export const getDocLink = (name: string): string => `${docLink}${name}`

export const createRule = ESLintUtils.RuleCreator((name) => getDocLink(name))
