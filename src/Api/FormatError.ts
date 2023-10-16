/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-03-13T12:03:82+01:00
 * @Copyright: Technology Studio
**/

import type { GraphQLFormattedError } from 'graphql'
import { Log } from '@txo/log'

import {
  isGraphQLError, unwrapAdvancedGraphQLError,
} from './CreateError'

const log = new Log('txo.error-graphql.src.Api.FormatError')

export const formatError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  log.debugLazy(`formatError ${error?.constructor?.name}`, () => JSON.stringify({ formattedError, error }, null, 2))
  if (!isGraphQLError(error)) {
    return formattedError
  }

  const advancedGraphQLError = unwrapAdvancedGraphQLError(error)

  if (advancedGraphQLError != null) {
    return advancedGraphQLError.format(formattedError)
  }

  return formattedError
}
