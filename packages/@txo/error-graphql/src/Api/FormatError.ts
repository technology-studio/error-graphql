/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Date: 2020-03-13T12:03:82+01:00
 * @Copyright: Technology Studio
**/

import {
  formatError as formatApolloError,
  ErrorInfo,
} from 'apollo-errors'
import type { GraphQLError, GraphQLFormattedError } from 'graphql'

import { ErrorType } from '../Model/Types'

interface FixedErrorInfo extends Omit<ErrorInfo, 'path'> {
  path?: string [],

}
declare module 'apollo-errors' {
  interface ErrorInfo {
    key?: string,
    type?: string,
    // @ts-expect-error TODO: it's issue in apollo-errors
    path: string[],
  }
}

interface InternalError extends Error {
  internalData?: {
    validationPath: string,
    key: string,
    type: ErrorType,
  },
}

interface ExtendedGraphQLFormattedError extends GraphQLFormattedError {
  key?: string,
  type?: ErrorType,
}

export const formatError = (error: GraphQLError): ExtendedGraphQLFormattedError => {
// export function formatError (error: any): ErrorInfo {
  const originalError = error.originalError as InternalError

  console.log(error?.constructor?.name, JSON.stringify(error))
  const formattedApolloError = formatApolloError(error) as FixedErrorInfo
  const validationPath = originalError?.internalData?.validationPath
  if (formattedApolloError.path && validationPath) {
    formattedApolloError.path = formattedApolloError.path.concat(validationPath)
  }
  return {
    ...formattedApolloError,
    key: originalError?.internalData?.key,
    type: originalError?.internalData?.type,
  }
}
