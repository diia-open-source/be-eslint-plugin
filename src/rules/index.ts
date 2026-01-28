import loggerErrField from './loggerErrField'
import noServiceWordInPackageJsonNameField, {
    ruleName as noServiceWordInPackageJsonNameFieldRuleName,
} from './noServiceWordInPackageJsonNameField'

export default {
    'logger-err-field': loggerErrField,
    [noServiceWordInPackageJsonNameFieldRuleName]: noServiceWordInPackageJsonNameField,
}
