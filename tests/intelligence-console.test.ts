import assert from "node:assert/strict";
import test from "node:test";
import { getIntelligenceGrade } from "@/components/intelligence/IntelligenceGrade";

test("maps intelligence scores to presentation grades", () => {
  assert.equal(getIntelligenceGrade(99), "A+");
  assert.equal(getIntelligenceGrade(92), "A");
  assert.equal(getIntelligenceGrade(87), "A-");
  assert.equal(getIntelligenceGrade(82), "B+");
  assert.equal(getIntelligenceGrade(77), "B");
  assert.equal(getIntelligenceGrade(72), "B-");
  assert.equal(getIntelligenceGrade(67), "C+");
  assert.equal(getIntelligenceGrade(62), "C");
  assert.equal(getIntelligenceGrade(57), "C-");
  assert.equal(getIntelligenceGrade(52), "D");
  assert.equal(getIntelligenceGrade(49), "F");
});

