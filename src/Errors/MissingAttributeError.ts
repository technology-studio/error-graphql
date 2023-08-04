/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-03-13T12:03:63+01:00
 * @Copyright: Technology Studio
**/

import { createError } from '../Api/CreateError'
import {
  MISSING_ATTRIBUTE, VALIDATION,
} from '../Model/Types'

const MissingAttributeError = createError('MissingAttributeError', {
  message: 'Missing attribute error.',
  key: MISSING_ATTRIBUTE,
  type: VALIDATION,
  options: {
    showPath: true,
  },
})

export {
  MissingAttributeError,
}
