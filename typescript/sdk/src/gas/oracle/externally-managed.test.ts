import { expect } from 'chai';

import { diffObjMerge } from '@humanode-hyperlane/utils';

import { HookType, IgpSchema } from '../../hook/types.js';

import { withoutExternallyManagedGasOracleValues } from './externally-managed.js';

const OWNER = '0x1111111111111111111111111111111111111111';

const igp = (oracleConfig: Record<string, Record<string, unknown>>) => ({
  type: HookType.INTERCHAIN_GAS_PAYMASTER,
  owner: OWNER,
  beneficiary: '0x2222222222222222222222222222222222222222',
  oracleKey: '0x3333333333333333333333333333333333333333',
  overhead: { remote: 50000 },
  oracleConfig,
});

// The chain's entry, as a read reports it.
const read = (
  gasPrice: string,
  tokenExchangeRate: string,
  tokenDecimals = 18,
) => igp({ remote: { gasPrice, tokenExchangeRate, tokenDecimals } });

const external = (tokenDecimals = 18) =>
  igp({
    remote: {
      initialGasPrice: '10000000',
      initialTokenExchangeRate: '10174943916314466',
      tokenDecimals,
    },
  });

const core = <Hook>(defaultHook: Hook) => ({
  owner: OWNER,
  defaultHook,
  requiredHook: { type: HookType.MERKLE_TREE },
});

const differs = (actual: unknown, expected: unknown) => {
  const [a, e] = withoutExternallyManagedGasOracleValues(actual, expected);
  return diffObjMerge(a as any, e as any).isInvalid;
};

describe('externally managed gas oracle entries', () => {
  describe('the schema', () => {
    it('takes either form of an entry', () => {
      expect(IgpSchema.safeParse(read('1', '2')).success).to.be.true;
      expect(IgpSchema.safeParse(external()).success).to.be.true;
    });

    it('refuses an entry mixing the two forms', () => {
      const mixed = igp({
        remote: {
          gasPrice: '1',
          tokenExchangeRate: '2',
          initialGasPrice: '1',
          initialTokenExchangeRate: '2',
        },
      });
      expect(IgpSchema.safeParse(mixed).success).to.be.false;
      const half = igp({
        remote: { gasPrice: '1', initialTokenExchangeRate: '2' },
      });
      expect(IgpSchema.safeParse(half).success).to.be.false;
    });
  });

  describe('the check', () => {
    it('leaves the chain values out for an externally managed entry', () => {
      expect(
        differs(core(read('263028458', '11984283093450343')), core(external())),
      ).to.be.false;
    });

    it('still compares the token decimals and the remotes priced', () => {
      expect(differs(core(read('1', '2', 18)), core(external(6)))).to.be.true;
      const otherRemote = igp({
        other: { initialGasPrice: '1', initialTokenExchangeRate: '2' },
      });
      expect(differs(core(read('1', '2')), core(otherRemote))).to.be.true;
    });

    it('still compares everything else of the IGP', () => {
      const otherBeneficiary = {
        ...external(),
        beneficiary: '0x4444444444444444444444444444444444444444',
      };
      expect(differs(core(read('1', '2')), core(otherBeneficiary))).to.be.true;
    });

    it('compares a config-managed entry as before', () => {
      expect(differs(core(read('1', '2')), core(read('1', '3')))).to.be.true;
      expect(differs(core(read('1', '2')), core(read('1', '2')))).to.be.false;
    });

    it('finds an IGP inside an aggregation hook', () => {
      const aggregation = (hook: unknown) => ({
        type: HookType.AGGREGATION,
        hooks: [{ type: HookType.MERKLE_TREE }, hook],
      });
      expect(
        differs(
          core(aggregation(read('1', '2'))),
          core(aggregation(external())),
        ),
      ).to.be.false;
    });

    it('changes neither config', () => {
      const actual = core(read('1', '2'));
      const expected = core(external());
      withoutExternallyManagedGasOracleValues(actual, expected);
      expect(actual.defaultHook.oracleConfig.remote.gasPrice).to.equal('1');
      expect(expected.defaultHook.oracleConfig.remote.initialGasPrice).to.equal(
        '10000000',
      );
    });
  });
});
