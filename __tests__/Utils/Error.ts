/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-10-12T19:10:27+02:00
 * @Copyright: Technology Studio
 */

export const stubStack = <ERROR extends Error>(error: ERROR, customStack?: string[]): ERROR => {
  if (customStack == null) {
    customStack = [
      'Error: Custom Error',
      '    at CustomFunction (/path/to/custom/file:line:column)',
      '    at AnotherFunction (/path/to/another/file:line:column)',
    ]
  }

  Object.defineProperty(error, 'stack', {
    value: customStack.join('\n'),
    writable: true,
    configurable: true,
  })

  return error
}

export class NoErrorThrownError extends Error {}

export const getError = async <ERROR>(call: () => Promise<unknown>): Promise<ERROR> => {
  try {
    await call()
  } catch (error) {
    return error as ERROR
  }
  throw new NoErrorThrownError()
}
