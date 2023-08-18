import { describe } from "vitest"
import { testData, testDocument, testProofs } from "./common.ts"

const type = "Creed"

describe.each(testData[type])('$filename', ({filepath, creed}) => {

  testDocument(creed, filepath)

  const item = creed.Data

  testProofs(item)
})
