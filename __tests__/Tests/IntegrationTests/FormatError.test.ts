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
    includeStacktraceInErrorResponses: true,
    formatError,
  }).executeOperation({
    query: 'query Books { books { title } }',
    variables: { },
  })
}

const logicalToISOStringSpyOn = (): void => {
  let counter = 0
  jest.spyOn(Date.prototype, 'toISOString').mockImplementation(() => {
    const minutes = Math.floor(counter / 60)
    const seconds = counter % 60
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    counter++
    return `2023-01-01T00:${timeString}Z`
  })
}

describe('Integration test - FormatError', () => {
  beforeEach(() => {
    logicalToISOStringSpyOn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should handle a generic Error', async () => {
    const result = await executeErrorOperation(new Error('Generic Error'))
    expect(result).toMatchInlineSnapshot(`
      {
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "INTERNAL_SERVER_ERROR",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
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
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
        },
      }
    `)
  })

  test('should handle MissingAttributeError with default configuration', async () => {
    const result = await executeErrorOperation(new MissingAttributeError())
    expect(result).toMatchInlineSnapshot(`
      {
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T00:00:00Z",
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Missing attribute error.",
                "path": [
                  "books",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
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
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "data": {
                    "custom": "data",
                  },
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T00:00:00Z",
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Custom Message",
                "path": [
                  "books",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
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
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T00:00:00Z",
                  "validationPath": [
                    "path",
                    "to",
                    "error",
                  ],
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Missing attribute error.",
                "path": [
                  "books",
                  "path",
                  "to",
                  "error",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
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
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T01:00:00Z",
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Missing attribute error.",
                "path": [
                  "books",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
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
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T00:00:00Z",
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Missing attribute error.",
                "path": [
                  "books",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
        },
      }
    `)
  })

  test('should serialize error with mixed configurations', async () => {
    const result = await executeErrorOperation(
      new MissingAttributeError({
        message: 'Custom Message',
        data: { attribute: 'value' },
        internalData: { internal: 'data' },
      }),
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "body": {
          "kind": "single",
          "singleResult": {
            "data": {
              "books": null,
            },
            "errors": [
              {
                "extensions": {
                  "code": "VALIDATION_ERROR",
                  "data": {
                    "attribute": "value",
                  },
                  "key": "missing-attribute",
                  "name": "MissingAttributeError",
                  "stacktrace": [
                    "Error: Custom Error",
                    "    at CustomFunction (/path/to/custom/file:line:column)",
                    "    at AnotherFunction (/path/to/another/file:line:column)",
                  ],
                  "timeThrown": "2023-01-01T00:00:00Z",
                },
                "locations": [
                  {
                    "column": 15,
                    "line": 1,
                  },
                ],
                "message": "Custom Message",
                "path": [
                  "books",
                ],
              },
            ],
          },
        },
        "http": {
          "headers": Map {
            "cache-control" => "no-store",
          },
          "status": undefined,
        },
      }
    `)
  })
})
