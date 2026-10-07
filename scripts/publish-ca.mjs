import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isSolanaAddress } from "../src/domain/solana-address.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const configPath = "src/config/token.json";
const configFile = new URL(`../${configPath}`, import.meta.url);

function run(command, args, visible = false) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    stdio: visible ? "inherit" : "pipe",
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed${result.stderr ? `: ${result.stderr.trim()}` : ""}`,
    );
  return result.stdout?.trim() ?? "";
}
const git = (...args) => run("git", args);

function publish() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const values = args.filter((arg) => arg !== "--dry-run");
  const mint = values[0]?.trim() ?? "";
  if (values.length !== 1 || !isSolanaAddress(mint))
    throw new Error(
      "Provide the official 32-byte base58 Solana mint: npm run publish:ca -- YOUR_CA",
    );
  if (git("branch", "--show-current") !== "main")
    throw new Error("Switch to main before publishing the CA.");
  if (git("status", "--porcelain"))
    throw new Error(
      "The working tree has uncommitted changes. Commit or stash them before publishing the CA.",
    );
  if (dryRun) {
    console.log(
      `Valid mint: ${mint}\nSwap: https://pump.fun/coin/${mint}\nDry run: no files changed, no commits or pushes.`,
    );
    return;
  }
  const npmCli = process.env.npm_execpath;
  if (!npmCli)
    throw new Error(
      "Run this command through npm: npm run publish:ca -- YOUR_CA",
    );

  // Fast-forward only: never reset local work, force-push or resolve a merge implicitly.
  run("git", ["pull", "--ff-only", "origin", "main"], true);
  const pending = git("log", "--format=", "--name-only", "origin/main..HEAD")
    .split(/\r?\n/)
    .filter(Boolean);
  if (pending.some((path) => path !== configPath))
    throw new Error(
      "There are other local commits ahead of origin/main. Publish or review them separately first.",
    );

  const original = readFileSync(configFile, "utf8");
  const config = JSON.parse(original);
  const next = JSON.stringify({ ...config, mint }, null, 2) + "\n";
  let committed = false;
  let staged = false;
  try {
    writeFileSync(configFile, next);
    run(process.execPath, [npmCli, "run", "build"], true);
    if (git("diff", "--name-only", "--", configPath)) {
      git("add", "--", configPath);
      staged = true;
      run(
        "git",
        ["commit", "-m", `Set official FVF mint to ${mint}`, "--", configPath],
        true,
      );
      committed = true;
    }
  } catch (error) {
    // Only restore the exact content written by this command, preserving concurrent edits.
    if (!committed && readFileSync(configFile, "utf8") === next) {
      writeFileSync(configFile, original);
      if (staged) git("restore", "--staged", "--", configPath);
    }
    throw error;
  }

  try {
    run("git", ["push", "origin", "HEAD:main"], true);
  } catch (error) {
    throw new Error(
      `${error.message}\nThe CA commit is saved locally. Rerun the same command to retry the push.`,
    );
  }
  console.log(
    `\nPublished CA: ${mint}\nSwap: https://pump.fun/coin/${mint}\nCommit: ${git("rev-parse", "--short", "HEAD")}\nVercel will publish this change after its automatic deployment finishes.\nProduction: https://fvf-six.vercel.app`,
  );
}

try {
  publish();
} catch (error) {
  console.error(`\nCA publication stopped: ${error.message}`);
  process.exitCode = 1;
}
