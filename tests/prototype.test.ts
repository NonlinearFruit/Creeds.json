import { describe, test, expect } from 'vitest'

let fs = require('fs');
let repoPath = require('path').resolve(__dirname, '..')
let creedFolder = `${repoPath}/creeds`
let files = fs.readdirSync(creedFolder)
let Validator = require('jsonschema').Validator;
let validator = new Validator()
let metadataSchema = require(`${__dirname}/Metadata.schema.json`)

describe.each(files)('%s', (filename) => {
  let creed = require(`${creedFolder}/${filename}`)

  test('has metadata', async () => {
    let result = validator.validate(creed, metadataSchema)
    expect(result.valid, result).toBeTruthy()
  })

  test(`matches ${creed.Metadata.CreedFormat} schema`, async () => {
    let schemaFormat = creed.Metadata.CreedFormat;
    let schema = require(`${__dirname}/${schemaFormat}.schema.json`)
    let result = validator.validate(creed, schema)
    expect(result.valid, result).toBeTruthy()
  })

  test('is ascii', async () => {
    function isAscii(str) {
          return /^[\x00-\x7F]*$/.test(str);
    }
    let fileContent = fs.readFileSync(`${creedFolder}/${filename}`)
    expect(isAscii(creed)).toBeTruthy()
  })

  test('footnote for each proof text', async () => {
    let data = creed.Data
    if (!(data instanceof Array))
      data = [data]
    for (const item of data)
    {
      if (!item.Proofs || !(item.Proofs instanceof Array))
        continue
      const text = Object
        .entries(item)
        .filter(([key, _]) => key.endsWith('WithProofs'))
        .map(([_, value]) => value)
        .reduce((a, b) => a + b, '')
      for (const proof of item.Proofs)
        expect(text).toContain(`[${proof.Id}]`)
    }
  })

  test('proof text for each footnote', async () => {
    let data = creed.Data
    if (!(data instanceof Array))
      data = [data]
    for (const item of data)
    {
      if (!item.Proofs || !(item.Proofs instanceof Array))
        continue
      const footnoteIds = Object
        .entries(item)
        .filter(([key, _]) => key.endsWith('WithProofs'))
        .map(([_, textWithProofs]) => textWithProofs)
        .reduce((a, b) => a + b, '')
        .match(/(?<=\[)\d+(?=\])/g)
      const proofTextIds = item
        .Proofs
        .map((proof) => proof.Id.toString())
      if (footnoteIds)
        for (const footnoteId of footnoteIds)
          expect(proofTextIds).toContain(footnoteId)
    }
  })

  test('no footnotes in non-WithProofs strings', async () => {
    let data = creed.Data
    if (!(data instanceof Array))
      data = [data]
    for (const item of data)
    {
      if (!item.Proofs || !(item.Proofs instanceof Array))
        continue
      const footnoteIds = Object
        .entries(item)
        .filter(([key, _]) => !key.endsWith('WithProofs'))
        .map(([_, textWithoutProofs]) => textWithoutProofs)
        .reduce((a, b) => a + b, '')
        .match(/(?<=\[)\d+(?=\])/g)
      expect(footnoteIds).toBeNull()
    }
  })
})
