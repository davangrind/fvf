import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { imageMimeFromBytes } from "../../src/domain/artwork";
describe("artwork type detection independent of browser MIME metadata", () => {
  it("recognizes the real WebP asset when File.type is absent", () => {
    expect(imageMimeFromBytes(readFileSync("public/art/fly.webp"))).toBe(
      "image/webp",
    );
  });
  it("recognizes PNG and JPEG signatures", () => {
    expect(
      imageMimeFromBytes(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])),
    ).toBe("image/png");
    expect(imageMimeFromBytes(new Uint8Array([255, 216, 255, 224]))).toBe(
      "image/jpeg",
    );
  });
  it("rejects empty data, plain text and a RIFF file that is not WebP", () => {
    expect(imageMimeFromBytes(new Uint8Array())).toBeNull();
    expect(
      imageMimeFromBytes(new TextEncoder().encode("<svg>not accepted</svg>")),
    ).toBeNull();
    expect(
      imageMimeFromBytes(new TextEncoder().encode("RIFF0000WAVE")),
    ).toBeNull();
  });
});
