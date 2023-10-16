/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-04T08:08:01+02:00
 * @Copyright: Technology Studio
**/

import {
  GraphQLError, type GraphQLErrorExtensions, type GraphQLFormattedError,
} from 'graphql'
import { isNotEmptyString } from '@txo/types'
import { Log } from '@txo/log'

import {
  type ErrorCode,
  type ConstructorConfig,
  type CreateConfig,
} from '../Model/Types'

const log = new Log('txo.error-graphql.src.Api.CreateError')

const stringFallback = (args: (string | null | undefined)[], defaultValue: string | (() => string)): string => {
  for (const arg of args) {
    if (isNotEmptyString(arg)) {
      return arg
    }
  }
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue
}

export interface AdvancedGraphQLErrorExtensions {
  name: string,
  code: ErrorCode,
  key: string,
  validationPath?: string[],
  timeThrown: string,
  data?: Record<string, unknown>,
  internalData?: Record<string, unknown>,
}

const add = <KEY extends keyof AdvancedGraphQLErrorExtensions>(extensions: AdvancedGraphQLErrorExtensions, key: KEY, value: AdvancedGraphQLErrorExtensions[KEY]): AdvancedGraphQLErrorExtensions => {
  if (value !== undefined && (typeof value !== 'object' || Object.keys(value).length > 0)) {
    extensions[key] = value
  }
  return extensions
}

const extensionsFactory = (name: string, config: CreateConfig, ctorConfig: ConstructorConfig): GraphQLErrorExtensions => {
  const ctorData = ctorConfig.data ?? {}
  const ctorInternalData = ctorConfig.internalData ?? {}
  const configData = config.data ?? {}
  const configInternalData = config.internalData ?? {}
  const data = { ...configData, ...ctorData }
  const internalData = { ...configInternalData, ...ctorInternalData }
  const extensions = {
    name,
    code: config.code,
    key: config.key,
    timeThrown: stringFallback([ctorConfig.time_thrown, config.time_thrown], () => (new Date()).toISOString()),
  } satisfies AdvancedGraphQLErrorExtensions

  add(extensions, 'data', data)
  add(extensions, 'internalData', internalData)
  add(extensions, 'validationPath', ctorConfig.validationPath)

  return extensions
}

export class AdvancedGraphQLError extends GraphQLError {
  constructor (name: string, config: CreateConfig, ctorConfig: ConstructorConfig = {}) {
    super(stringFallback([ctorConfig.message, config.message], ''), {
      extensions: extensionsFactory(name, config, ctorConfig),
    })
    this.name = name
  }

  getExtensions (): AdvancedGraphQLErrorExtensions {
    return this.extensions as unknown as AdvancedGraphQLErrorExtensions
  }

  format (originalGraphQLFormattedError: GraphQLFormattedError): GraphQLFormattedError {
    log.debugLazy('format', () => JSON.stringify({ originalGraphQLFormattedError, this: this }, null, 2))
    const { validationPath } = this.getExtensions()
    if (validationPath != null && validationPath.length > 0) {
      return {
        ...originalGraphQLFormattedError,
        path: [...originalGraphQLFormattedError.path ?? this.path ?? [], ...validationPath],
      }
    }
    return originalGraphQLFormattedError
  }
}

export const isGraphQLError = (error: unknown): error is GraphQLError => error instanceof GraphQLError

export const isAdvancedGraphQLErrorInstance = (e: unknown): e is AdvancedGraphQLError => e instanceof AdvancedGraphQLError

export const unwrapAdvancedGraphQLError = (error: GraphQLError): AdvancedGraphQLError | undefined => {
  let pivotError: GraphQLError | undefined = error
  let advancedGraphQLError: AdvancedGraphQLError | undefined
  while (pivotError != null) {
    if (isAdvancedGraphQLErrorInstance(pivotError)) {
      advancedGraphQLError = pivotError
    }
    pivotError = (
      pivotError.originalError != null && isGraphQLError(pivotError.originalError)
        ? pivotError.originalError
        : undefined
    )
  }
  return advancedGraphQLError
}

type PublicPart<T> = {
  [K in keyof T]: T[K];
} & Error

export const createError = (name: string, config: CreateConfig): new (constructorConfig?: ConstructorConfig) => PublicPart<AdvancedGraphQLError> => (
  AdvancedGraphQLError.bind(null, name, config)
)
