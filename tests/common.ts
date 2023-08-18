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

export const testReferences = (proofs: Proof[]) => {
  test('each proof reference is valid', async () => {
    if (!proofs || !(proofs instanceof Array))
      return
    for (const proof of proofs) {
      expect(proof.References).toBeInstanceOf(Array)
    }
  })
}
