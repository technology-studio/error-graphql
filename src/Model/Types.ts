/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-11T12:04:62+02:00
 * @Copyright: Technology Studio
**/

import { type ApolloServerErrorCode } from '@apollo/server/errors'
export const ERROR_CODE_VALIDATION_ERROR = 'VALIDATION_ERROR'

export interface AllErrorCodes {
  VALIDATION_ERROR: typeof ERROR_CODE_VALIDATION_ERROR,
}

export type ErrorCode = AllErrorCodes[keyof AllErrorCodes] | ApolloServerErrorCode

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
}

export interface CreateConfig extends BaseConfig {
  key: string,
  code: ErrorCode,
}

export interface ConstructorConfig extends BaseConfig {
  validationPath?: string[],
}

export interface AdvancedGraphQLFormattedErrorExtensions {
  key: string,
  code: ErrorCode,
  name: string,
  timeThrown: string,
  data?: Record<string, unknown>,
}
