/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-11T12:04:62+02:00
 * @Copyright: Technology Studio
**/

import type {
  GraphQLFormattedError, SourceLocation,
} from 'graphql'

export const VALIDATION = 'validation'

export interface AllErrorTypes {
  VALIDATION: typeof VALIDATION,
}

export type ErrorType = AllErrorTypes[keyof AllErrorTypes]

export const INVALID_ATTRIBUTE = 'invalid-attribute'
export const MISSING_ATTRIBUTE = 'missing-attribute'
export const NOT_FOUND = 'not-found'

export interface AllErrorKeys {
  INVALID_ATTRIBUTE: typeof INVALID_ATTRIBUTE,
  MISSING_ATTRIBUTE: typeof MISSING_ATTRIBUTE,
  NOT_FOUND: typeof NOT_FOUND,
}

export type ErrorKey = AllErrorKeys[keyof AllErrorKeys]

export interface BaseConfig {
  message?: string,
  time_thrown?: string,
  data?: Record<string, unknown>,
  internalData?: Record<string, unknown>,
  options?: {
    showPath?: boolean,
    showLocations?: boolean,
  },
}

export interface CreateConfig extends BaseConfig {
  key: string,
  type?: ErrorType,
}

export interface ConstructorConfig extends BaseConfig {
  validationPath?: string[],
}

export interface SerialisedApolloError {
  key: string,
  type?: ErrorType,
  message: string,
  name: string,
  time_thrown: string,
  data?: Record<string, unknown>,
  path?: (string | number)[],
  locations?: readonly SourceLocation[],
}

export interface ExtendedGraphQLFormattedError extends GraphQLFormattedError {
  name: string,
  key: string,
  type?: ErrorType,
}
