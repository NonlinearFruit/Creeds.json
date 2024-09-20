import { describe, test, expect } from "vitest"
import { resolve } from "path";
import { readdirSync, readFileSync } from "fs"
import { bcv_parser as BcvParcer } from "bible-passage-reference-parser/js/en_bcv_parser"
import { Validator } from "jsonschema"
import TJS from "typescript-json-schema"
import type { CreedDocument, Proof } from "./types.ts"

const repoPath = resolve(__dirname, '..')
const creedFolder = `${repoPath}/creeds`
const files = readdirSync(creedFolder)
const testData = files.reduce((acc, filename) => {
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

const referenceParser = new BcvParcer()

const schemas = {}
for(const typeName of ["Metadata", "Proof", "Creed", "Canon", "Confession", "Catechism", "HenrysCatechism"])
  schemas[typeName] = TJS.generateSchema(program, typeName, settings)

const validateSchema = (typeName, document) => {
  test(`matches ${typeName} schema`, async () => {
    const schema = schemas[typeName]

    const result = validator.validate(document, schema)

    expect(result.valid, result).toBeTruthy()
  })
}

const testDocument = (document: CreedDocument<any>, filename: string) => {
  validateSchema("Metadata", document.Metadata)

  validateSchema(document.Metadata.CreedFormat, document)

  test('is ascii', async () => {
    let buf = readFileSync(filename)
    const len=buf.length
    for (let i=0; i<len; i++)
      expect(127, "This character is bad: "+i).toBeGreaterThan(buf[i])
  })
}

const testReferences = (proof: any) => {
  for(const reference of proof.References) {
    test(`${reference} is a single reference`, async () => {
      expect(reference).not.toContain(';')
    })

    test(`${reference} is OSIS`, async () => {
      const osis = referenceParser.parse(reference).osis()
      expect(reference).toEqual(osis)
    })
  }
}

const testProofs = (item: any) => {
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

  if (!item.Proofs) {
    return
  }

  test('each footnote has a proof text', () => {
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

  test('proof ids are consecuative starting with one', () => {
    item
      .Proofs
      .map(p => p.Id)
      .sort((a, b) => a-b)
      .forEach((id, index) => expect(id).toEqual(index+1));
  })

  describe.each(item.Proofs)('Proof: $Id', (proof) => {
    validateSchema("Proof", proof)

    testReferences(proof)

    test('has a footnote', async () => {
      const text = Object
        .entries(item)
        .filter(([key, _]) => key.endsWith('WithProofs'))
        .map(([_, value]) => value)
        .reduce((a, b) => a + b, '')
      expect(text).toContain(`[${proof.Id}]`)
    })
  })
}

describe.each(testData.Canon)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  let data = creed.Data
  if (data instanceof Array)
    data = data.map(item => ({
      title: `${item.Number ?? item.Article ?? item.Chapter} ${item.Title ?? item.Question}`,
      item
    }))
  else
    data = [{
      title: "Content",
      item: data
    }]
  describe.each(data)('$title', ({item}) => {
    testProofs(item)
  })
})

describe.each(testData.Catechism)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  let data = creed.Data
  if (data instanceof Array)
    data = data.map(item => ({
      title: `${item.Number ?? item.Article ?? item.Chapter} ${item.Title ?? item.Question}`,
      item
    }))
  else
    data = [{
      title: "Content",
      item: data
    }]
  describe.each(data)('$title', ({item}) => {
    testProofs(item)
  })
})

describe.each(testData.Confession)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  let data = creed.Data
  if (data instanceof Array)
    data = data.map(item => ({
      title: `${item.Number ?? item.Article ?? item.Chapter} ${item.Title ?? item.Question}`,
      item
    }))
  else
    data = [{
      title: "Content",
      item: data
    }]
  describe.each(data)('$title', ({item}) => {
    testProofs(item)
  })
})

describe.each(testData.Creed)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  const item = creed.Data

  testProofs(item)
})

describe.each(testData.HenrysCatechism)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  let data = creed.Data
  if (data instanceof Array)
    data = data.filter(item => item.SubQuestions.length != 0).map(item => ({
      title: `${item.Number ?? item.Article ?? item.Chapter} ${item.Title ?? item.Question}`,
      item
    }))
  else
    data = [{
      title: "Content",
      item: data
    }]
  describe.each(data)('$title', ({item}) => {
    describe.each(item.SubQuestions)('$Number $Question', (subquestion) => {
      testProofs(subquestion)
    })
  })
})
