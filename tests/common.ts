import { test, expect } from "vitest"
import type { Proof } from "./types.ts"

export const testReferences = (proofs: Proof[]) => {
  test('each proof reference is valid', async () => {
    if (!proofs || !(proofs instanceof Array))
      return
    for (const proof of proofs) {
      expect(proof.References).toBeInstanceOf(Array)
    }
  })
}
