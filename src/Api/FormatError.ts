/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-03-13T12:03:82+01:00
 * @Copyright: Technology Studio
**/

import type {
  GraphQLError,
} from 'graphql'
import { Log } from '@txo/log'

import type {
  ExtendedGraphQLFormattedError,

} from '../Model/Types'

import {
  isApolloErrorInstance,
} from './CreateError'

const log = new Log('txo.error-graphql.src.Api.FormatError')

export const formatErrorInternal = (error: GraphQLError): GraphQLError | ExtendedGraphQLFormattedError => {
  const originalError = error.originalError ?? error

  log.debugLazy(`formatError ${error?.constructor?.name}`, () => JSON.stringify(error, null, 2))

  if (!isApolloErrorInstance(originalError)) {
    return error
  }

  const serialisedError = originalError.serialize(error)

  return serialisedError
}
