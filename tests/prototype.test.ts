import { describe, test, expect } from 'vitest'

interface Resource {
  Metadata: Metadata
  Data: any
}

interface Metadata {
  Title: string
  AlternativeTitles: string[]
  eAlternativeTitles: string[]
}

describe('suite', () => {
  test('serial test', async () => { 
    let data = require('../creeds/zwinglis_67_articles.json') 
    expect(data).toBeTruthy()
    data as Resource
    expect(data.Metadata).toBeTruthy()
    expect(data.Metadata.Title).toBe("Zwingli's 67 Articles")
  })
})
