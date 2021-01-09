'use strict'

const path = require('path')
const os = require('os')
const fs = require('fs')

class ChineseRoom {
  constructor(initOptions={}) {
    this._privateOptions = {
      _logsDirectoryExists: false,
    }
    this.defaultOptions = {
      logsOutputDirectory: path.resolve() + '/logs/',
      watchLogsDirectory: false,
      writeToFile: false,
      writeToConsole: true,
      useColoredOutput: true,
      useTimestamp: true,
      errorFileName: 'error.txt',
      logFileName: 'log.txt',
    }
    this.colors = {
      reset: '\x1b[0m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      blue: '\x1b[34m',
      black: '\x1b[30m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
    }

    this.options = this._normalizeInitOptions(initOptions)
  }

  _checkLogsOutputDirectory() {
    const logsOutputDirectory = this.options.logsOutputDirectory

    return new Promise((resolve, reject) => {
      // Check if logs output directory exists
      fs.access(logsOutputDirectory, error => {
        if (error) {
          // Create logs output directory
          fs.mkdir(logsOutputDirectory, error => {
            if (error) {
              if (error.code == 'EEXIST') resolve()
              else {
                throw error

                reject()
              }
            }

            this._privateOptions._logsDirectoryExists = true

            resolve()
          })
        }

        resolve()
      })
    })
  }

  _normalizeInitOptions(initOptions) {
    const normalizedInitOptions = {}

    for (let [option, defaultValue] of Object.entries(this.defaultOptions)) {
      const initValue = initOptions[option]

      normalizedInitOptions[option] = initValue === undefined ? defaultValue : initValue
    }

    return normalizedInitOptions
  }

  getOptions() {
    return this.options
  }

  setDefaultOptions() {
    this.options = this.defaultOptions
  }

  log(text) {
    const logString = `[LOG] ${text}`

    return this._write(logString, 'log', 'blue')
  }

  error(text) {
    const logString = `[ERROR] ${text}`

    return this._write(logString, 'error', 'red')
  }

  async _write(logString, type, color) {
    if (this.options.writeToConsole) {
      this._writeToConsole(logString, color)
    }

    if (this.options.writeToFile) {
      let fileName = null

      switch(type) {
        case 'log': {
          fileName = this.options.logFileName

          break
        }
        case 'error': {
          fileName = this.options.errorFileName

          break
        }
      }

      if (this._privateOptions._logsDirectoryExists == false) {
        await this._checkLogsOutputDirectory()

        return this._writeToFile(logString, fileName)
      }

      if (this.options.watchLogsDirectory) await this._checkLogsOutputDirectory()

      return this._writeToFile(logString, fileName)
    }
  }

  _writeToConsole(text, color) {
    if (this.options.useTimestamp) {
      const timestamp = this._getFormatedTimestamp()

      if (this.options.useColoredOutput) {
        // Change color for write timestamp
        process.stdout.write(this.colors.yellow)

        // Write timestamp
        process.stdout.write(timestamp)

        // Reset text color
        process.stdout.write(this.colors.reset)

      } else {
        // Write timestamp
        process.stdout.write(timestamp)
      }
    }

    if (this.options.useColoredOutput) {
      // Set text color
      process.stdout.write(this.colors[color])

      // Write text
      console.log(text)

      // Reset text color
      process.stdout.write(this.colors.reset)

    } else {
      console.log(text)
    }
  }

  async _writeToFile(text, fileName) {
    const logsOutputDirectory = this.options.logsOutputDirectory
    const filePath = logsOutputDirectory + fileName
    let logString = text + os.EOL

    if (this.options.useTimestamp) {
      const timestamp = this._getFormatedTimestamp()

      logString = timestamp + logString
    }

    return new Promise((resolve, reject) => {
      fs.appendFile(filePath, logString, error => {
        if (error) {
          throw error

          reject()
        }

        resolve()
      })
    })
  }

  _getTimestamp() {
    return new Date().toLocaleString()
  }

  _getFormatedTimestamp() {
    const timestamp = this._getTimestamp()

    return `[${timestamp}] `
  }

  async clearAllLogs() {
    const logsOutputDirectory = this.options.logsOutputDirectory

    // Get all log files
    const logFiles = await new Promise((resolve, reject) => {
      fs.readdir(logsOutputDirectory, (error, files) => {
        if (error) {
          throw error

          reject()
        }

        resolve(files)
      })
    })

    const promises = []

    for (let i = 0; i < logFiles.length; i++) {
      const fileName = logFiles[i]

      promises.push(new Promise((resolve, reject) => {
        fs.writeFile(logsOutputDirectory + fileName, '', error => {
          if (error) {
            throw error

            reject()
          }

          resolve()
        })
      }))
    }

    return Promise.all(promises)
  }

  clearErrorFile() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.options.logsOutputDirectory + this.options.errorFileName, '', error => {
        if (error) {
          throw error

          reject()
        }

        resolve()
      })
    })
  }

  clearLogFile() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.options.logsOutputDirectory + this.options.logFileName, '', error => {
        if (error) {
          throw error

          reject()
        }

        resolve()
      })
    })
  }
}


module.exports = ChineseRoom
