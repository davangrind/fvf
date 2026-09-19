import type { LaunchAdapter, LaunchInput, LaunchResult } from "../domain/types";
/** Fail closed. Implement against verified Pons deployment after supplying fee recipients,
 * metadata storage, wallet client and indexed attribution. See docs/PONS-INTEGRATION.md. */
export class PonsProductionAdapter implements LaunchAdapter {
  readonly source = "chain" as const;
  async launch(_input: LaunchInput): Promise<LaunchResult> {
    throw new Error(
      "Production launch is not configured. No transaction was requested.",
    );
  }
}
