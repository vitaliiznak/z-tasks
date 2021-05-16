/* eslint-disable prefer-rest-params */
function getArrayWithLimitedLength(length: number) {
  const array: any[] = []
  const pushOrig = array.push.bind(array)
  array.push = function p1(...rest) {
    if (this.length >= length) {
      this.shift()
    }
    // eslint-disable-next-line prefer-rest-params
    return pushOrig(...rest)
  }

  return array
}

export const consoleHistory = getArrayWithLimitedLength(30)

/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

export const init = () => {
  const defaultLog = console.log.bind(console)
  console.log = function log(...rest: any[]) {
    consoleHistory.push({ type: 'log', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    defaultLog(...rest)
  }
  const defaultError = console.error.bind(console)
  console.error = function error(...rest: any[]) {
    consoleHistory.push({ type: 'error', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    defaultError(...rest)
  }
  const defaultWarn = console.warn.bind(console)
  console.warn = function warn(...rest: any[]) {
    consoleHistory.push({ type: 'warn', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    defaultWarn(...rest)
  }
  const defaultDebug = console.debug.bind(console)
  // eslint-disable-next-line func-names
  console.debug = function debug(...rest: any[]) {
    consoleHistory.push({ type: 'debug', datetime: Date().toLocaleString(), value: Array.from(arguments) })
    defaultDebug(...rest)
  }
}
