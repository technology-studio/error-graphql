/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-05-09T15:05:92+02:00
 * @Copyright: Technology Studio
**/

import { createError } from 'apollo-errors'
import { ErrorType, ErrorKey } from '../Model/Types'

const InvalidAttributeError = createError('InvalidAttributeError', {
  message: 'Invalid attribute error.',
  options: {
    showPath: true,
  },
  internalData: {
    key: ErrorKey.INVALID_ATTRIBUTE,
    type: ErrorType.VALIDATION,
  },
})

export {
  InvalidAttributeError,
}
