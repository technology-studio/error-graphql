/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-03-13T12:03:82+01:00
 * @Copyright: Technology Studio
**/

import type {
  GraphQLError, GraphQLFormattedError,
} from 'graphql'
import { Log } from '@txo/log'

import type {
  ExtendedGraphQLFormattedError,

} from '../Model/Types'

import {
  isAdvancedGraphQLErrorInstance,
} from './CreateError'

const log = new Log('txo.error-graphql.src.Api.FormatError')

export const formatError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  const originalError = error.originalError ?? error

  log.debugLazy(`formatError ${error?.constructor?.name}`, () => JSON.stringify(error, null, 2))

  if (!isAdvancedGraphQLErrorInstance(originalError)) {
    return formattedError
  }

  return originalError.format(formattedError, error)
}
