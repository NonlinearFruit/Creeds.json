import { resolve } from "path";
import { readdirSync, readFileSync } from "fs"
import { describe, test, expect } from "vitest"
import { Validator } from "jsonschema"
import TJS from "typescript-json-schema"

const validator = new Validator()

const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
}
const program = TJS.getProgramFromFiles(
  [resolve("tests/types.ts")],
  compilerOptions
)
const settings: TJS.PartialArgs = {
  required: true,
}

const type = "Creed"
const repoPath = resolve(__dirname, '..')
const creedFolder = `${repoPath}/creeds`
const files = readdirSync(creedFolder)
const testData = files
  .map(filename => ({
    filename,
    creed: require(`${creedFolder}/${filename}`)
  }))
  .filter(testData => testData.creed.Metadata.CreedFormat == type)

describe.each(testData)('$filename', ({filename, creed}) => {

  test('has metadata', async () => {
    const schema = TJS.generateSchema(program, "Metadata", settings)

    const result = validator.validate(creed.Metadata, schema)

    expect(result.valid, result).toBeTruthy()
  })

  test(`matches ${creed.Metadata.CreedFormat} schema`, async () => {
    const schema = TJS.generateSchema(program, creed.Metadata.CreedFormat, settings)

    const result = validator.validate(creed, schema)

    expect(result.valid, result).toBeTruthy()
  })

  test('is ascii', async () => {
    let buf = readFileSync(`${creedFolder}/${filename}`)
    const len=buf.length
    for (let i=0; i<len; i++)
      expect(buf[i]).toBeLessThan(127)
  })

  const item = creed.Data

  test('each footnote has a proof text', () => {
    if (!item.Proofs || !(item.Proofs instanceof Array))
      return
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
  })

  test('each proof text has a footnote', async () => {
    if (!item.Proofs || !(item.Proofs instanceof Array))
      return
    const text = Object
      .entries(item)
      .filter(([key, _]) => key.endsWith('WithProofs'))
      .map(([_, value]) => value)
      .reduce((a, b) => a + b, '')
    for (const proof of item.Proofs)
      expect(text).toContain(`[${proof.Id}]`)
  })

  test('each proof reference is valid', async () => {
    if (!item.Proofs || !(item.Proofs instanceof Array))
      return
    for (const proof of item.Proofs) {
      expect(proof.References).toBeInstanceOf(Array)
    }
  })

  test('no footnotes in non-WithProofs strings', async () => {
    const footnoteIds = Object
      .entries(item)
      .filter(([key, _]) => !key.endsWith('WithProofs'))
      .filter(([_, obj]) => typeof obj == "string")
      .map(([_, textWithoutProofs]) => textWithoutProofs)
      .reduce((a, b) => a + b, '')
      .match(/(?<=\[)\d+(?=\])/g)
    expect(footnoteIds).toBeNull()
  })
})
