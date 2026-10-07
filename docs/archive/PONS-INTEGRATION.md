# Connecting FVF to pons

Research date: 2026-09-20. This is an implementation plan, not a claim that FVF is deployed or that any address below was bytecode-verified by this MVP. **The application is demo-only.** No secrets or recipient wallets are configured.

## What was actually inspected

- [Current pons creation form](https://www.ponsfamily.com/launchpad/create), including the V2 selector, advanced fields, desktop and mobile. The older `pons.family` hostname failed DNS in the local browser. The current hostname worked and displayed a backend-degradation notice.
- [Official contract repository](https://github.com/ponsdotdev/pons-labs), its V1/V2 README, and V2 factory, curve, hook, and interface source. Read-only copies used during research are under `research/pons/`, with their original SPDX notices. They are reference snapshots, not deployable FVF contracts.
- [pons documentation](https://docs.ponsfamily.com/). Its landing page describes V1. The V2 documentation route was region-blocked in the research web environment; it was not treated as evidence for V2 behavior.
- [UsePaid creation flow](https://usepaid.app/launch), including selecting Pons, and [UsePaid docs](https://usepaid.app/docs). The latter explicitly says the pons payment integration is not live. A visible Pons tab is not evidence of a production integration.

## Integration target and verification

The official repository lists Robinhood Chain ID **4663**, V1 factory `0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB`, and V2 factory `0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e`. These are research references only, deliberately not executable frontend constants. V1 creates V3 liquidity immediately; V2 creates a curve with subsequent V4 graduation. Do not combine their ABIs or fee assumptions. [Official repository](https://github.com/ponsdotdev/pons-labs)

Before production, pin a source commit, resolve verified deployed contracts through the explorer, compare deployed bytecode and ABI, and read current launch configuration, permissions, fee policy, paired asset and operational status through a reliable RPC. Do not derive transaction calldata from this document or an unpinned `main` branch. The source contains owner-controlled launch permissions and configurations; check the wallet is eligible before presenting a signing flow.

## Launch and recipient routing

The inspected V2 factory has `launchToken(TokenParams, launchConfigId, pairToken)` and an overload accepting snipe-tax exemptions. `TokenParams` includes identity/social metadata, `creatorFeeRecipient`, creator tax, buyback setting, `expectedEconomics`, and a salt. `previewLaunchEconomics` supplies the economics guard. The UI also offers an optional developer buy; do not assume that an arbitrary extra native value executes that buy via the base factory call. Inspect and verify the current forwarder/router if adding an atomic buy. [V2 factory source](https://github.com/ponsdotdev/pons-labs/blob/main/contractsV2/src/v2/PonsV2LaunchFactory.sol)

FVF needs two reviewed fee-recipient addresses, one for each faction, associated with a fixed battle ID. Their custody and collection authority remain a product decision. A contract recipient must be able to claim its escrow balances; sending fees to an arbitrary inert contract can strand them. Token-specific forwarding recipients may simplify attribution but require contract design and review. Do not choose that financial architecture implicitly.

UsePaid's fee-lock wording must not be carried over as an FVF guarantee. The inspected V2 source allows current-recipient transfers and a protocol-owner delayed recipient-change process. Track recipient-change proposals and executions, and stop attributing future fees when a token no longer routes to the registered faction. Explain these powers before an actual launch. [V2 factory source](https://github.com/ponsdotdev/pons-labs/blob/main/contractsV2/src/v2/PonsV2LaunchFactory.sol)

Recommended real-wallet flow:

1. Connect an EVM account and verify/switch to the configured chain with explicit wallet confirmation.
2. Validate metadata length in encoded bytes against the deployed contracts. Upload permitted image content to a persistent IPFS/storage service; retain its content-addressed URL.
3. Read current launch fee, supply, fee policy, launch config, quote asset, recipient, and optional approval requirements. Pin the quoted economics and a unique salt.
4. Present the full token, faction, recipient address, creator share, tax/buyback choice, gas estimate, and each required signature. There is no extra FVF tax defined by this MVP.
5. Simulate the exact call, obtain explicit user signing, wait for the receipt, and verify the factory event and resulting recipient. Never turn an account connection into automatic signing.
6. Register the confirmed token address/battle/faction association. Only then show it as onchain. Handle rejection, reversion, dropped/replaced transactions, and indexer delay separately.

## Recognizing FVF recruits

Create an authenticated registry keyed by `(chainId, factory, tokenAddress, battleId)` with a faction, expected recipient, source transaction, and registration time. A name, ticker, URL, or description alone cannot prove FVF origin. Derive a token's curve and eventual pool from factory events/state. Reconcile the registry against onchain recipient changes. Expose provenance on every production token and event.

## Contribution accounting

Do not estimate received creator fees as `volume × headline fee`, count donations as token fees, or attribute a shared wallet's complete balance to one token.

The curve emits `FeesSwept(protocolAmount, buybackAmount, creatorAmount)` from a token-specific curve address. The hook emits pool-specific `PoolFeesSwept`. Factory/curve/hook mappings link those events to a token and quote asset. Escrow `balanceOf` and `balanceOfToken` represent claimable recipient balances, not a per-token contribution ledger. [Curve source](https://github.com/ponsdotdev/pons-labs/blob/main/contractsV2/src/v2/PonsV2BondingCurve.sol), [hook source](https://github.com/ponsdotdev/pons-labs/blob/main/contractsV2/src/v2/hooks/PonsV2MemeHook.sol), [escrow interface](https://github.com/ponsdotdev/pons-labs/blob/main/contractsV2/src/v2/interfaces/ILaunchpadV2.sol)

Build an indexer with these separate records:

| Record            | Meaning                                                   |
| ----------------- | --------------------------------------------------------- |
| Accrued           | Earned by a token, not yet swept                          |
| Credited          | Swept to the faction's escrow entitlement                 |
| Received          | Claimed and demonstrably received by the battle recipient |
| Display valuation | Timestamped conversion of a specified asset amount        |

Choose and publish which finality-qualified record increments battle power. The intended production pool should use attributable **received** creator fees; show pending amounts separately. Shared-recipient claim batches need a deterministic reconciliation ledger back to their token credits. A sweep and its later claim are the same funds at different stages and must never be counted twice. Verify call success, event recipient at the relevant block, token, quote currency, and any rescue/direct-transfer path.

Store amounts as bigint base units plus asset decimals; use integers/fixed point for financial calculation. Persist `(chainId, blockHash, transactionHash, logIndex, accountingStage)` and unique constraints, support rollback/replay for reorgs, and take confirmed battle snapshots at the cutoff. Keep a durable cursor and use bounded RPC log ranges. Conversion to USD requires a chosen price source and timestamp; the demo USD values are not a pricing implementation.

## Exact code seams

- `src/domain/types.ts`: `LaunchAdapter`, `LaunchInput`, provenance-discriminated `LaunchResult`, `BattleDataAdapter`, `BattleResolver`, and `SettlementAdapter`.
- `src/data/production-adapter.ts`: production launch entry point. It throws before any network/wallet action until a real implementation exists. There is intentionally no guessed API endpoint, ABI encoding, or environment toggle that pretends to enable mainnet.
- `src/data/demo-adapter.ts`: local simulator, local receipts, notifications, persistence. Keep this isolated from production services.
- `src/state.tsx`: current demo data-store binding. Introduce an indexed production store here and generalize the explicitly demo-only snapshot/token/event schemas with verified chain provenance before enabling a production UI. Never relabel seeded records as live.
- `src/domain/battle.ts`: pure accounting/progression and `advancePhase(snapshot, now, resolver)`. Replace the resolver independently of arena animation. Production phase/result/cutoff must come from an authoritative service, not a browser clock.
- `src/pages/Launch.tsx`: input and review. Replace the demo quote/review with verified recipient, real fees, and transaction simulation results; use the real launch adapter only after that review is complete.
- Settlement is disabled. Decide prize logic, custody, permissions, audits and any jurisdictional requirements independently. This MVP implements no chance-based financial mechanics.

## Deliberately absent

No recipient deployment, treasury management, signing server, fee collector, public API, indexer, oracle, swaps, mainnet transaction, payout promise, or smart-contract deployment. Completing those requires the configuration and design choices above; none is necessary to run the complete local product demo.
