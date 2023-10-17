/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-05-09T15:05:92+02:00
 * @Copyright: Technology Studio
**/

import { createError } from '../Api/CreateError'
import {
  ERROR_CODE_VALIDATION_ERROR,
  INVALID_ATTRIBUTE,
} from '../Model/Types'

const InvalidAttributeError = createError('InvalidAttributeError', {
  message: 'Invalid attribute error.',
  key: INVALID_ATTRIBUTE,
  code: ERROR_CODE_VALIDATION_ERROR,
})

export {
  InvalidAttributeError,
}
