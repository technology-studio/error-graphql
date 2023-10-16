/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-04T08:08:01+02:00
 * @Copyright: Technology Studio
**/

import {
  GraphQLError, type GraphQLErrorExtensions, type GraphQLFormattedError,
} from 'graphql'
import { isNotEmptyString } from '@txo/types'

import {
  type AdvancedGraphQLFormattedErrorExtensions,
  type ConstructorConfig,
  type CreateConfig,
  type ErrorType,
} from '../Model/Types'

const stringFallback = (args: (string | null | undefined)[], defaultValue: string | (() => string)): string => {
  for (const arg of args) {
    if (isNotEmptyString(arg)) {
      return arg
    }
  }
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue
}

interface AdvancedGraphQLErrorExtensions {
  key: string,
  type?: ErrorType,
  validationPath?: string[],
  timeThrown: string,
  data: Record<string, unknown>,
  internalData: Record<string, unknown>,
}

const extensionsFactory = (config: CreateConfig, ctorConfig: ConstructorConfig): GraphQLErrorExtensions => {
  const ctorData = ctorConfig.data ?? {}
  const ctorInternalData = ctorConfig.internalData ?? {}
  const configData = config.data ?? {}
  const configInternalData = config.internalData ?? {}
  const data = { ...configData, ...ctorData }
  const internalData = { ...configInternalData, ...ctorInternalData }

  return {
    key: config.key,
    type: config.type,
    data,
    internalData,
    timeThrown: stringFallback([ctorConfig.time_thrown, config.time_thrown], () => (new Date()).toISOString()),
    validationPath: ctorConfig.validationPath,
  } satisfies GraphQLErrorExtensions
}

export class AdvancedGraphQLError extends GraphQLError {
  constructor (name: string, config: CreateConfig, ctorConfig: ConstructorConfig = {}) {
    super(stringFallback([ctorConfig.message, config.message], ''), {
      extensions: extensionsFactory(config, ctorConfig),
    })
    this.name = name
  }

  format (originalGraphQLFormattedError: GraphQLFormattedError): GraphQLFormattedError {
    const {
      key,
      type,
      name,
      message,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      time_thrown,
      data,
      _showLocations,
      _showPath,
      validationPath,
    } = this

    const serialisedError: AdvancedGraphQLFormattedErrorExtensions = {
      key,
      type,
      message,
      name,
      time_thrown,
      data,
      locations: parentError.locations ?? this.locations,
    }

    if (parentError.path != null || this.path != null || validationPath != null) {
      serialisedError.path = [...(parentError.path ?? this.path ?? []), ...(validationPath ?? [])]
    }

    return new GraserialisedError()
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
