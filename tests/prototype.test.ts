import { describe, test, expect } from 'vitest'

interface Resource {
  Metadata: Metadata
  Data: any
}

interface Metadata {
  Title: string
  AlternativeTitles: string[]
  eAlternativeTitles: string[]
}

let fs = require('fs');
let path = require('path');
let repoPath = require('path').resolve(__dirname, '..')
let creedFolder = repoPath+'/creeds'
let files = fs.readdirSync(creedFolder)
let Validator = require('jsonschema').Validator;
let validator = new Validator()
let metadataSchema = require(__dirname+'/Metadata.schema.json')

describe.each(files)('%s', (filename) => {
  let creed = require(creedFolder+'/'+filename)

  test('has metadata', async () => {
    let result = validator.validate(creed, metadataSchema)
    expect(result.valid, result).toBeTruthy()
  })

  test('matches schema', async () => {
    let schemaFormat = creed.Metadata.CreedFormat;
    let schema = require(__dirname+'/'+schemaFormat+'.schema.json')
    let result = validator.validate(creed, schema)
    expect(result.valid, result).toBeTruthy()
  })

  test('is ascii', async () => {
    function isAscii(str) {
          return /^[\x00-\x7F]*$/.test(str);
    }
    let fileContent = fs.readFileSync(creedFolder+'/'+filename)
    expect(isAscii(creed)).toBeTruthy()
  })
})
