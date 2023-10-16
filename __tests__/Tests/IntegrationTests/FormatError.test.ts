/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-10-12T09:10:88+02:00
 * @Copyright: Technology Studio
 */

import {
  ApolloServer, gql,
} from 'apollo-server'

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
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "extensions": {
              "code": "INTERNAL_SERVER_ERROR",
              "exception": {
                "stacktrace": [
                  "Error: Custom Error",
                  "    at CustomFunction (/path/to/custom/file:line:column)",
                  "    at AnotherFunction (/path/to/another/file:line:column)",
                ],
              },
            },
            "locations": [
              {
                "column": 15,
                "line": 1,
              },
            ],
            "message": "Generic Error",
            "path": [
              "books",
            ],
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })

  test('should handle MissingAttributeError with default configuration', async () => {
    const result = await executeErrorOperation(new MissingAttributeError())
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })

  test('should handle MissingAttributeError with custom message and data', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        message: 'Custom Message',
        data: { custom: 'data' },
      }),
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {
              "custom": "data",
            },
            "key": "missing-attribute",
            "message": "Custom Message",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })

  test('should handle MissingAttributeError with validationPath', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        validationPath: ['path', 'to', 'error'],
      }),
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "path": [
              "books",
              "path",
              "to",
              "error",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
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
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "locations": [
              {
                "column": 15,
                "line": 1,
              },
            ],
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })

  test('should handle MissingAttributeError with time_thrown', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        time_thrown: '2023-01-01T01:00:00Z',
      }),
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T01:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })

  test('should handle MissingAttributeError with internalData', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        internalData: { internal: 'data' },
      }),
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
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
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {},
            "key": "missing-attribute",
            "message": "Missing attribute error.",
            "name": "MissingAttributeError",
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
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
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "books": null,
        },
        "errors": [
          {
            "data": {
              "attribute": "value",
            },
            "key": "missing-attribute",
            "locations": [
              {
                "column": 15,
                "line": 1,
              },
            ],
            "message": "Custom Message",
            "name": "MissingAttributeError",
            "path": [
              "books",
            ],
            "time_thrown": "2023-01-01T00:00:00Z",
            "type": "validation",
          },
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  })
})
