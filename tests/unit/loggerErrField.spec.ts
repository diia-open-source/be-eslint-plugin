import { ESLintUtils } from '@typescript-eslint/utils'

import rule from '../../src/rules/loggerErrField'

const ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
})

ruleTester.run('my-rule', rule, {
    valid: [
        'try {} catch {}',
        `
        try {} catch (e) {
            this.logger.error('message', {err: e})
        }
        `,
        `
        try {} catch(e) {
            const errLog = {
                err: e,
                oneMoreField: true
            }

            this.logger.error('message', errLog)
        }
        `,
        `
         try{} catch(e) {
            someFoo(e)

            this.logger.error('message', {someLog: true})
         }
        `,
        `
        try {
            const result = await this.external.receive<{ data: string }>(ExternalEvent.CryptographyAuthIitDecrypt, encryptedUser)

            return JSON.parse(result!.data)
        } catch (e) {
            return await utils.handleError(e, (someError) => {
                this.logger.error('Error when decrypting response from BankId', { error: someError })

                throw new UnauthorizedError()
            })
        }
       `,
        `
       try {
            const result = await this.external.receive<{ data: string }>(ExternalEvent.CryptographyAuthIitDecrypt, encryptedUser)

            return JSON.parse(result!.data)
        } catch (e) {
            const err = someFoo(e)
            const err2= someFoo2(e)

            this.logger.error('message', {err})
        }`,
    ],
    invalid: [
        {
            code: `
                try {

                } catch (e) {
                    this.logger.error('message', {field: e})
                }
            `,
            errors: [
                {
                    messageId: 'err-field',
                },
            ],
        },
        {
            code: `
            try {} catch(e) {
                const errLog = {
                    error: e
                }
    
                this.logger.error('message', errLog)
            }
            `,
            errors: [
                {
                    messageId: 'err-field',
                },
            ],
        },
    ],
})
