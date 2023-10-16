/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-07-02T13:07:00+02:00
 * @Copyright: Technology Studio
**/

import { createError } from '../Api/CreateError'
import {
  ERROR_CODE_VALIDATION_ERROR, NOT_FOUND,
} from '../Model/Types'

const NotFoundError = createError('NotFoundError', {
  message: 'Not found error.',
  key: NOT_FOUND,
  code: ERROR_CODE_VALIDATION_ERROR,
})

export { NotFoundError }
