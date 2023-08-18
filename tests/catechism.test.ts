import { describe } from "vitest"
import { testData, testDocument, testProofs } from "./common.ts"

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
