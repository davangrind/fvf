# Solana / pump.fun integration

## Current release

FVF targets Solana and pump.fun. The frontend connects Phantom, prepares metadata drafts and links to pump.fun creation. The homepage purchase link is gated by `VITE_FVF_CA`. It does not mint tokens, submit trades or collect fees.

Catalog records use preview provenance. The `PumpProductionAdapter` fails before requesting any transaction. A production result must contain a Solana mint, transaction signature and `mainnet-beta` cluster, with no EVM address or chain-ID assumptions.

## Primary references checked 2026-10-07

- [pump.fun creation](https://pump.fun/create): token metadata, liquidity pair, creator-reward options and external wallet flow
- [pump.fun fees](https://pump.fun/docs/fees): creator fees are distinct from protocol and LP fees; schedules vary by market stage and market cap
- [Phantom provider detection](https://docs.phantom.com/solana/detecting-the-provider): prefer `window.phantom.solana`
- [Phantom connection](https://docs.phantom.com/solana/establishing-a-connection): account access, public key and disconnect lifecycle
- [Solana frontend development](https://solana.com/docs/frontend)

The manual calculator's 1% is an explicit arithmetic example. Do not use it as a hardcoded production fee rate.

## Required before chain-backed launches and metrics

1. Verify the current pump.fun program and supported creation / creator-recipient instructions. Select the intended pair and explicit creator-reward policy.
2. Store metadata durably, then build and review exact instructions with the connected Solana wallet. Connection alone never authorizes signing.
3. Confirm a successful transaction, verify the resulting mint and fee destination, and register it against the FVF arena and participant.
4. Index eligible creator-fee transfers with signature and instruction identity, integer base units, denomination, timestamps and confirmation policy. Make replay and retries idempotent.
5. Keep accrued, claimable, claimed and received amounts separate. Choose and publish which state counts toward event progression.
6. Reconcile destinations and totals, and stop attribution if recipient configuration changes. Use an explicit price source for USD conversions.
7. Switch the UI to verified records and update the global data-source status only when that source is connected.

The public token catalog contains no invented mint addresses. FVF record IDs are internal IDs and must never be passed to a swap URL.
