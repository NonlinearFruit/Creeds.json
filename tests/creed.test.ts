import { describe } from "vitest"
import { testData, testDocument, testProofs } from "./common.ts"

describe.each(testData.Creed)('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  const item = creed.Data

  testProofs(item)
})
