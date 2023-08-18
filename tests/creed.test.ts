import { describe, test, expect } from "vitest"
import { testData, testReferences, testDocument } from "./common.ts"

const type = "Creed"

describe.each(testData[type])('$filename', ({filename, filepath, creed}) => {

  testDocument(creed, filepath)

  const item = creed.Data

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
})
