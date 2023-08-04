/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-04T08:08:01+02:00
 * @Copyright: Technology Studio
**/

import { ExtendableError } from 'extendable-error'
import {
  type GraphQLError, type SourceLocation,
} from 'graphql'

import {
  type ConstructorConfig,
  type CreateConfig,
  type ErrorType,
  type SerialisedApolloError,
} from '../Model/Types'

const stringFallback = (args: (string | null | undefined)[], defaultValue: string | (() => string)): string => {
  for (const arg of args) {
    if (arg != null && arg !== '') {
      return arg
    }
  }
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue
}

class ApolloError extends ExtendableError {
  name: string
  message: string
  key: string
  type?: ErrorType
  validationPath?: string[]
  time_thrown: string
  data: Record<string, unknown>
  internalData: Record<string, unknown>
  path?: (string | number)[]
  locations?: SourceLocation[]
  _showLocations
  _showPath

  constructor (name: string, config: CreateConfig, ctorConfig: ConstructorConfig = {}) {
    super(stringFallback([ctorConfig.message, config.message], ''))

    const timeThrown = stringFallback([ctorConfig.time_thrown, config.time_thrown], () => (new Date()).toISOString())
    const message = stringFallback([ctorConfig.message, config.message], '')
    const ctorData = ctorConfig.data ?? {}
    const ctorInternalData = ctorConfig.internalData ?? {}
    const configData = config.data ?? {}
    const configInternalData = config.internalData ?? {}
    const data = { ...configData, ...ctorData }
    const internalData = { ...configInternalData, ...ctorInternalData }
    const ctorOptions = ctorConfig.options ?? {}
    const configOptions = config.options ?? {}
    const options = { ...configOptions, ...ctorOptions }

    this.key = config.key
    this.type = config.type
    this.validationPath = ctorConfig.validationPath
    this.name = name
    this.message = message
    this.time_thrown = timeThrown
    this.data = data
    this.internalData = internalData
    this._showLocations = options.showLocations ?? false
    this._showPath = options.showPath ?? false
  }

  serialize (parentError: GraphQLError): SerialisedApolloError {
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

    const serialisedError: SerialisedApolloError = {
      key,
      type,
      message,
      name,
      time_thrown,
      data,
    }

    if (_showLocations) {
      serialisedError.locations = parentError.locations ?? this.locations
    }

    if (_showPath) {
      if (parentError.path != null || this.path != null || validationPath != null) {
        serialisedError.path = [...(parentError.path ?? this.path ?? []), ...(validationPath ?? [])]
      }
    }

    return serialisedError
  }
}

export const isApolloErrorInstance = (e: unknown): e is ApolloError => e instanceof ApolloError

export const createError = (name: string, config: CreateConfig): typeof ApolloError.constructor => (
  ApolloError.bind(null, name, config)
)
