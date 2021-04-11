/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Date: 2020-07-02T13:07:00+02:00
 * @Copyright: Technology Studio
**/

import { createError } from 'apollo-errors'
import { ErrorKey } from '../Model/Types'

const NotFoundError = createError('NotFoundError', {
  message: 'Not found error.',
  options: {
    showPath: true,
  },
  internalData: {
    key: ErrorKey.NOT_FOUND,
  },
})

export { NotFoundError }
