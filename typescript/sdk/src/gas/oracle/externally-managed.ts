import { HookType } from '../../hook/types.js';

/**
 * The two sides of a check made comparable for the externally managed oracle
 * entries of `expected`. Each such entry's values are its manager's, not the
 * config's, so the chain's `gasPrice`, `tokenExchangeRate` and `typicalCost`
 * leave the `actual` entry, and `initialGasPrice` and
 * `initialTokenExchangeRate` leave the `expected` one; what remains of the
 * entry, its token decimals, is compared as before, and so is everything else.
 *
 * `actual` is a config read from the chain, `expected` a config to check it
 * against. Their IGPs are matched by their place in the two configs (the
 * default or required hook, a hook inside an aggregation or a routing hook),
 * so an IGP that `expected` does not have where `actual` does is left to the
 * comparison to report. Neither config is changed: the results are copies.
 */
export function withoutExternallyManagedGasOracleValues<Actual, Expected>(
  actual: Actual,
  expected: Expected,
): [Actual, Expected] {
  const [a, e] = align(actual, expected);
  return [a as Actual, e as Expected];
}

const MANAGER_FIELDS = ['gasPrice', 'tokenExchangeRate', 'typicalCost'];
const INITIAL_FIELDS = ['initialGasPrice', 'initialTokenExchangeRate'];

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function omit(value: unknown, fields: string[]): unknown {
  if (!isObject(value)) return value;
  const copy = { ...value };
  for (const field of fields) delete copy[field];
  return copy;
}

function align(actual: unknown, expected: unknown): [unknown, unknown] {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    const pairs = expected.map((e, i) => align(actual[i], e));
    return [
      actual.map((a, i) => (i < pairs.length ? pairs[i][0] : a)),
      pairs.map(([, e]) => e),
    ];
  }
  if (!isObject(actual) || !isObject(expected)) return [actual, expected];

  const a: Record<string, unknown> = { ...actual };
  const e: Record<string, unknown> = { ...expected };
  for (const key of Object.keys(e)) {
    if (key in a) [a[key], e[key]] = align(a[key], e[key]);
  }

  if (
    e.type === HookType.INTERCHAIN_GAS_PAYMASTER &&
    isObject(e.oracleConfig) &&
    isObject(a.oracleConfig)
  ) {
    const actualEntries: Record<string, unknown> = { ...a.oracleConfig };
    const expectedEntries: Record<string, unknown> = { ...e.oracleConfig };
    for (const [remote, entry] of Object.entries(expectedEntries)) {
      if (!isObject(entry) || entry.initialGasPrice === undefined) continue;
      expectedEntries[remote] = omit(entry, INITIAL_FIELDS);
      if (remote in actualEntries) {
        actualEntries[remote] = omit(actualEntries[remote], MANAGER_FIELDS);
      }
    }
    a.oracleConfig = actualEntries;
    e.oracleConfig = expectedEntries;
  }
  return [a, e];
}
