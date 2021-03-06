<h1 align="center">Chinese room</h1>

<p align="center">Logger with color output to the console, timestamp support and the ability to write to a file.</p>

## Table of Contents

1. [Install](#install)
2. [Usage](#usage)
3. [Options](#options)
4. [Examples of using](#examples-of-using)
5. [API](#api)
   - [Methods](#methods)
6. [Community](#community)

## Install

Install with npm:

```bash
npm i chinese-room
```

## Usage

```javascript
const ChineseRoom = require('chinese-room')

const logger = new ChineseRoom({
  // Options
})

logger.log('Hello world.') // > [2021-01-10T15:12:08.464Z] [LOG] Hello world.
logger.error('Hello world.') // > [2021-01-10T15:12:08.464Z] [ERROR] Hello world.
```

To view the available options, see [Options](#options).

## Options

- **`logsOutputDirectory`**- the path to the directory where the log files will be stored.
  - ====
  - **Type**: `String`
  - **Default:** `path.resolve() + '/logs/'`
  - ====
- **`watchLogsDirectory`** - whether to check of the directory or file exists before writing logs to a file.
  - ====
  - **Note**: If during execution a directory or file with logs is accidentally or intentionally deleted, then if 	                     `false` , an error will be throw during the writing of logs to the file. If `true`, the directory or file will be recreated and logs will be written there.
  - **Type**: `Boolean`
  - **Default**: `false`
  - ====
- **`writeToFile`** - If `true`, logs will be written to a file.
  - ====
  - **Type**: `Boolean`
  - **Default**: `false`
  - ====
- **`writeToConsole`** - If `true`, logs will be written to console.
  - ====
  - **Type**: `Boolean`
  - **Default**: `true`
  - ====
- **`useColoredOutput`** - If `true`, the console output will be colored. Errors in red, logs in blue, timestamp in yellow.
  - ====
  - **Type**: `Boolean`
  - **Default**: `true`
  - ====
- **`useTimestamp`** - If `true`, a timestamp will be inserted before of logs and errors.
   - ====
   - **Type**: `Boolean`
   - **Default**: `true`
   - ====
- **`errorFileName`** - the name of the file to which errors will be written.
  - ====
  - **Type**: `String`
  - **Default**: `error.txt`
  - ====
- **`logFileName`** - the name of the file to which logs will be written.
  - ====
  - **Type**: `String`
  - **Default**: `log.txt`
  - ====

## Examples of using

Basic example with `express`:
```javascript
const express = require('express')
const ChineseRoom = require('chinese-room')

const server = express()
// Initialize logger
const logger = new ChineseRoom()

server.get('*', (req, res) => {
  // Write log
  logger.log(req.url)

  res.json({ ok: true })
})

server.listen(3000)
```

The console output will be as follow: `[2021-01-10T15:12:08.464Z] [LOG] /home`.

To write the log to a file, use the `writeToFile` option:

```javascript
const express = require('express')
const ChineseRoom = require('chinese-room')

const server = express()
// Initialize logger
const logger = new ChineseRoom({
  writeToFile: true, // * Just add this option
})

server.get('*', (req, res) => {
  // Write log
  // * This log will be written to file.
  logger.log(req.url)

  res.json({ ok: true })
})

server.listen(3000)
```
After that, a directory with the `log.txt` file will be created in the project root, if it doesn't exist.

To write to a file or print an error to the console, use the `error` method:

```javascript
server.use((serverError, req, res, next) => {
  // Write error
  logger.error(serverError)

  res.status(500).end('Server error. 500.')
})
```

To clear all log files use:

```javascript
logger.clearAllLogs()
```

See more in [Methods](#methods).

## API

### Methods

| Method | Param | Return  | Description |
| --- | ---| --- | --- |
| `logger.log` | `String` | `Promise` - if `writeToFile` = `true`, otherwise - `undefined`. | Outputs to the console and/or writes to a file the given string.
| `logger.error` | `String` | `Promise` - if `writeToFile` = `true`, otherwise - `undefined`. | Outputs to the console and/or writes to a file the given string.
| `logger.getOptions` | | `Object` | Returns an object with logger options.
| `logger.setDefaultOptions` | | `undefined` | Sets all logger options to default.
| `logger.clearAllLogs` | | `Promise` | Clears all log files.
| `logger.clearErrorFile` | | `Promise` | Cleans up the file with errors.
| `logger.clearLogFile` | | `Promise` | Clean up the file with logs.

## Community

Criticism, corrections, improvements, suggestions are welcome.
