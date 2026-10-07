import { afterEach, beforeEach, expect, it } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

const mint = "So11111111111111111111111111111111111111112";
let folder: string;
let root: string;
let remote: string;
function git(cwd: string, ...args: string[]) {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}
function publish(address = mint, buildFailure = false) {
  return spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      join(root, "scripts/publish-ca.mjs"),
      address,
    ],
    {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
      env: {
        ...process.env,
        FVF_TEST_BUILD_FAIL: buildFailure ? "1" : "0",
      },
    },
  );
}
beforeEach(() => {
  folder = mkdtempSync(join(tmpdir(), "fvf-ca-publish-"));
  root = join(folder, "checkout");
  remote = join(folder, "remote.git");
  mkdirSync(root);
  git(folder, "init", "--bare", remote);
  git(root, "init", "-b", "main");
  git(root, "config", "user.name", "Fixture");
  git(root, "config", "user.email", "fixture@example.invalid");
  git(root, "config", "commit.gpgsign", "false");
  git(root, "config", "core.autocrlf", "false");
  for (const path of ["scripts", "src/domain", "src/config"])
    mkdirSync(join(root, path), { recursive: true });
  for (const file of ["scripts/publish-ca.mjs", "src/domain/solana-address.ts"])
    copyFileSync(resolve(file), join(root, file));
  writeFileSync(join(root, "src/config/token.json"), '{\n  "mint": ""\n}\n');
  writeFileSync(
    join(root, "package.json"),
    '{"type":"module","scripts":{"build":"node fake-npm.cjs"}}',
  );
  writeFileSync(
    join(root, "fake-npm.cjs"),
    'process.exit(process.env.FVF_TEST_BUILD_FAIL === "1" ? 1 : 0);',
  );
  git(root, "add", ".");
  git(root, "commit", "-m", "Fixture");
  git(root, "remote", "add", "origin", remote);
  git(root, "push", "-u", "origin", "main");
});
afterEach(() => {
  const absolute = resolve(folder);
  if (
    !absolute.startsWith(resolve(tmpdir()) + sep) ||
    !absolute.split(sep).at(-1)?.startsWith("fvf-ca-publish-")
  )
    throw new Error("Unsafe temporary cleanup path");
  rmSync(absolute, { recursive: true, force: true });
});

it("publishes only the mint config and permits an unchanged retry", () => {
  const before = git(remote, "rev-parse", "main");
  const result = publish();
  expect(result.status, result.stderr + result.stdout).toBe(0);
  expect(
    JSON.parse(git(remote, "show", "main:src/config/token.json")).mint,
  ).toBe(mint);
  expect(git(remote, "diff", "--name-only", before, "main")).toBe(
    "src/config/token.json",
  );
  expect(git(root, "status", "--porcelain")).toBe("");
  const after = git(remote, "rev-parse", "main");
  expect(publish().status).toBe(0);
  expect(git(remote, "rev-parse", "main")).toBe(after);
}, 20000);

it("rejects invalid input without changing files or publishing", () => {
  const before = git(remote, "rev-parse", "main");
  expect(publish("not-an-address").status).toBe(1);
  expect(git(root, "status", "--porcelain")).toBe("");
  expect(git(remote, "rev-parse", "main")).toBe(before);
});

it("restores the previous config when the build fails", () => {
  const before = git(remote, "rev-parse", "main");
  const original = readFileSync(join(root, "src/config/token.json"), "utf8");
  expect(publish(mint, true).status).toBe(1);
  expect(readFileSync(join(root, "src/config/token.json"), "utf8")).toBe(
    original,
  );
  expect(git(root, "status", "--porcelain")).toBe("");
  expect(git(remote, "rev-parse", "main")).toBe(before);
});

it("does not sweep up unrelated uncommitted work", () => {
  const before = git(remote, "rev-parse", "main");
  writeFileSync(join(root, "unfinished.txt"), "Keep this");
  expect(publish().status).toBe(1);
  expect(readFileSync(join(root, "unfinished.txt"), "utf8")).toBe("Keep this");
  expect(git(remote, "rev-parse", "main")).toBe(before);
});
