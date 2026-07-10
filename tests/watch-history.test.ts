import assert from "node:assert/strict";
import test from "node:test";
import {
  appendSuccessfulWatchObservation,
  calculateWatchMarketChange,
  classifyWatchMovement,
  createWatchHistory,
  formatWatchingDuration,
} from "../features/watchlist/WatchHistory.ts";

test("captures stable watch creation metadata", () => {
  const history = createWatchHistory({
    addedAt: "2026-06-01T12:00:00.000Z",
    currentValuation: 100,
    lastRefresh: "2026-06-01T12:00:00.000Z",
    observationSource: "Repository",
    reasonAdded: "Track for sale",
  });
  assert.equal(history.initialMarketValuation, 100);
  assert.equal(history.initialObservationSource, "Repository");
  assert.equal(history.reasonAdded, "Track for sale");
  assert.equal(history.observations.length, 1);
});

test("calculates market change independently of target price", () => {
  assert.deepEqual(calculateWatchMarketChange(100, 111.3), {
    difference: 11.299999999999997,
    percentChange: 11.299999999999997,
  });
  assert.deepEqual(calculateWatchMarketChange(null, 111.3), {
    difference: null,
    percentChange: null,
  });
  assert.equal(calculateWatchMarketChange(0, 5).percentChange, null);
});

test("appends successful observations, suppresses exact duplicates, and bounds history", () => {
  let history = createWatchHistory({
    addedAt: "2026-01-01T00:00:00.000Z",
    currentValuation: 10,
    observationSource: "Repository",
  });
  for (let index = 1; index <= 40; index += 1) {
    history = appendSuccessfulWatchObservation(history, {
      observedAt: `2026-02-${String((index % 28) + 1).padStart(2, "0")}T00:${String(index).padStart(2, "0")}:00.000Z`,
      source: "Provider",
      valuation: 10 + index,
    });
  }
  assert.equal(history.observations.length, 32);
  const duplicate = history.observations.at(-1)!;
  assert.equal(
    appendSuccessfulWatchObservation(history, duplicate).observations.length,
    32,
  );
});

test("formats human watch age and classifies lightweight movement", () => {
  const now = new Date("2026-07-10T00:00:00.000Z").getTime();
  assert.equal(formatWatchingDuration("2026-06-22T00:00:00.000Z", now), "18 days");
  assert.equal(formatWatchingDuration("2026-04-01T00:00:00.000Z", now), "3 months");
  assert.equal(
    classifyWatchMovement([
      { observedAt: "1", source: "Repository", valuation: 10 },
      { observedAt: "2", source: "Provider", valuation: 12 },
    ]),
    "Rising",
  );
  assert.equal(
    classifyWatchMovement([
      { observedAt: "1", source: "Repository", valuation: 10 },
      { observedAt: "2", source: "Provider", valuation: 8 },
    ]),
    "Falling",
  );
});
