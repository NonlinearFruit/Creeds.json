import { test, expect } from "vitest"
import { resolve } from "path";
import { Validator } from "jsonschema"
import TJS from "typescript-json-schema"
import type { Proof } from "./types.ts"

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

export const validateSchema = (typeName, document) => {
  test(`matches ${typeName} schema`, async () => {
    const schema = TJS.generateSchema(program, typeName, settings)

    const result = validator.validate(document, schema)

    expect(result.valid, result).toBeTruthy()
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
