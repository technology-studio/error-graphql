/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-10-12T09:10:88+02:00
 * @Copyright: Technology Studio
 */

import {
  ApolloServer,
} from '@apollo/server'
import { gql } from 'graphql-tag'

import { stubStack } from 'Utils/Error'
import {
  MissingAttributeError, formatError,
} from 'src'

const typeDefs = gql`
type Book {
  title: String
  author: String
}

type Query {
  books: [Book]
}
`

const executeErrorOperation = async <ERROR extends Error>(error: ERROR): Promise<unknown> => {
  const stubedError = stubStack(error)
  const resolvers = {
    Query: {
      books: () => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw stubedError
      },
    },
  }
  return await new ApolloServer({
    typeDefs,
    resolvers,
    debug: true,
    formatError,
  }).executeOperation({
    query: 'query Books { books { title } }',
    variables: { },
  })
}

describe('Integration test - FormatError', () => {
  beforeAll(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T00:00:00Z')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('should handle a generic Error', async () => {
    const result = await executeErrorOperation(new Error('Generic Error'))
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with default configuration', async () => {
    const result = await executeErrorOperation(new MissingAttributeError())
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with custom message and data', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        message: 'Custom Message',
        data: { custom: 'data' },
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with validationPath', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        validationPath: ['path', 'to', 'error'],
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with showPath and showLocations options', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        options: {
          showPath: true,
          showLocations: true,
        },
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with time_thrown', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        time_thrown: '2023-01-01T01:00:00Z',
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should handle MissingAttributeError with internalData', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        internalData: { internal: 'data' },
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should serialize error without locations and path when options are false', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        options: {
          showPath: false,
          showLocations: false,
        },
      }),
    )
    expect(result).toMatchSnapshot()
  })

  test('should serialize error with mixed configurations', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        message: 'Custom Message',
        data: { attribute: 'value' },
        options: {
          showPath: true,
          showLocations: true,
        },
      }),
    )
    expect(result).toMatchSnapshot()
  })
})
