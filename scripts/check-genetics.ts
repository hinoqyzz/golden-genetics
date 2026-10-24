import assert from "node:assert/strict";
import { cross, phenotypeDistribution, traits } from "../lib/genetics.ts";

const aaAa = cross("AA", "Aa");
assert.deepEqual(aaAa.counts, { AA: 2, Aa: 2, aa: 0 });
assert.equal(aaAa.probabilities.AA, 0.5);
assert.equal(aaAa.probabilities.Aa, 0.5);

const hetero = cross("Aa", "Aa");
assert.deepEqual(hetero.counts, { AA: 1, Aa: 2, aa: 1 });
assert.equal(hetero.probabilities.Aa, 0.5);

const recessive = cross("Aa", "aa");
assert.deepEqual(recessive.counts, { AA: 0, Aa: 2, aa: 2 });

assert.deepEqual(cross("AA", "aa").counts, { AA: 0, Aa: 4, aa: 0 });
assert.deepEqual(cross("aa", "aa").counts, { AA: 0, Aa: 0, aa: 4 });
assert.deepEqual(cross("AA", "AA").counts, { AA: 4, Aa: 0, aa: 0 });

const pea = phenotypeDistribution(hetero, traits.ervilha);
assert.deepEqual(
  pea.map((item) => [item.label, item.count]),
  [
    ["Semente lisa", 3],
    ["Semente rugosa", 1],
  ],
);

const flower = phenotypeDistribution(hetero, traits.flor);
assert.deepEqual(
  flower.map((item) => [item.label, item.probability]),
  [
    ["Flor vermelha", 0.25],
    ["Flor rosa", 0.5],
    ["Flor branca", 0.25],
  ],
);

assert.equal(hetero.grid.length, 4);
console.log("genetics ok");
