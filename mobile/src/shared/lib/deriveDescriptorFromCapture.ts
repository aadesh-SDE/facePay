/**
 * Phase 4 spike: build a fixed-length numeric vector from a captured JPEG (base64).
 *
 * This is **not** a face-recognition embedding (no on-device ML yet). It ties the stored
 * template to **this specific photo bytes**, so re-capture changes the vector — enough to
 * prove **camera → descriptor → `PUT /api/v1/me/face-template`** until ML Kit / server-side
 * models replace it.
 */
export function deriveDescriptorFromCaptureBase64(base64: string): number[] {
  const s = base64.length > 400_000 ? base64.slice(0, 400_000) : base64;
  const acc = new Array<number>(128).fill(0);
  for (let i = 0; i < s.length; i++) {
    const slot = i % 128;
    const c = s.charCodeAt(i);
    acc[slot] += (c % 127) / 63.5 - 1;
  }
  const scale = Math.max(1, s.length / 8000);
  return acc.map((v) => {
    const x = v / scale;
    return Math.max(-0.08, Math.min(0.08, x));
  });
}
