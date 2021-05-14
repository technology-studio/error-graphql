/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Date: 2020-03-13T12:03:63+01:00
 * @Copyright: Technology Studio
**/

import { createError } from 'apollo-errors'
import { ErrorType, ErrorKey } from '../Model/Types'

const MissingAttributeError = createError('MissingAttributeError', {
  message: 'Missing attribute error.',
  options: {
    showPath: true,
  },
  internalData: {
    key: ErrorKey.MISSING_ATTRIBUTE,
    type: ErrorType.VALIDATION,
  },
})

export {
  MissingAttributeError,
}
