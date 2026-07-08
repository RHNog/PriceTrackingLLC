import assert from "node:assert/strict";
import test from "node:test";
import {
  getConfidenceLabel,
  getEvidenceAwareGrade,
  getIntelligenceGrade,
} from "@/components/intelligence/IntelligenceGrade";

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

test("maps numeric confidence to production confidence labels", () => {
  assert.equal(getConfidenceLabel(92), "Very High");
  assert.equal(getConfidenceLabel(75), "High");
  assert.equal(getConfidenceLabel(55), "Moderate");
  assert.equal(getConfidenceLabel(35), "Low");
  assert.equal(getConfidenceLabel(28), "Very Low");
});

test("maps insufficient evidence to Unknown instead of failing grade", () => {
  assert.equal(getEvidenceAwareGrade(0, "INSUFFICIENT"), "Unknown");
  assert.equal(getEvidenceAwareGrade(49, "INSUFFICIENT"), "Unknown");
  assert.equal(getEvidenceAwareGrade(92, "SUFFICIENT"), "A");
});
