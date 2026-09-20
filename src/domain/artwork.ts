// Some browser/OS combinations provide an empty File.type for valid uploads.
// Verify the file signature before constructing a correctly typed data URL.
export function imageMimeFromBytes(bytes: Uint8Array): string | null {
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b))
    return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return "image/jpeg";
  if (
    [82, 73, 70, 70].every((b, i) => bytes[i] === b) &&
    [87, 69, 66, 80].every((b, i) => bytes[i + 8] === b)
  )
    return "image/webp";
  return null;
}
