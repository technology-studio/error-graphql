/**
 * @Author: Ondrej Mikulas <ondrej.mikulas@technologystudio.sk>
 * @Date: 2020-03-13T12:03:82+01:00
 * @Copyright: Technology Studio
**/

import {
  formatError as formatApolloError,
  ErrorInfo,
} from 'apollo-errors'

declare module 'apollo-errors' {
  interface ErrorInfo {
    key?: string,
    type?: string,
  }
}

/* eslint  @typescript-eslint/explicit-module-boundary-types: 0, @typescript-eslint/no-explicit-any: 0 */
export function formatError (error: any): ErrorInfo {
  const { originalError } = error

  console.log(error?.constructor?.name, JSON.stringify(error))
  const formattedApolloError = formatApolloError(error)
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
