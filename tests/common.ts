import { test, expect } from "vitest"
import { resolve } from "path";
import { readdirSync, readFileSync } from "fs"
import { Validator } from "jsonschema"
import TJS from "typescript-json-schema"
import type { CreedDocument, Proof } from "./types.ts"

const repoPath = resolve(__dirname, '..')
const creedFolder = `${repoPath}/creeds`
const files = readdirSync(creedFolder)
export const testData = files.reduce((acc, filename) => {
  const filepath = `${creedFolder}/${filename}`
  const creed = require(filepath)
  const data = {
    filename,
    filepath,
    creed,
  }
  acc[creed.Metadata.CreedFormat] ??= []
  acc[creed.Metadata.CreedFormat].push(data)
  return acc
}, {})

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

const validateSchema = (typeName, document) => {
  test(`matches ${typeName} schema`, async () => {
    const schema = TJS.generateSchema(program, typeName, settings)

    const result = validator.validate(document, schema)

    expect(result.valid, result).toBeTruthy()
  })
}

export const testDocument = (document: CreedDocument<any>, filename: string) => {
  validateSchema("Metadata", document.Metadata)

  validateSchema(document.Metadata.CreedFormat, document)

  test('is ascii', async () => {
    let buf = readFileSync(filename)
    const len=buf.length
    for (let i=0; i<len; i++)
      expect(buf[i]).toBeLessThan(127)
  })
}

const testReferences = (proofs: Proof[]) => {
  test('each proof reference is valid', async () => {
    if (!proofs || !(proofs instanceof Array))
      return
    for (const proof of proofs) {
      expect(proof.References).toBeInstanceOf(Array)
      for (const reference of proof.References) {
        expect(reference).not.toContain(';')
      }
    }
  })
}

export const testProofs = (item: any) => {
  testReferences(item.Proofs)

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
}
