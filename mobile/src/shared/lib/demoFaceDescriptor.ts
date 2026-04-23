/** Placeholder 128-D vector for mobile until on-device face embedding ships. */
export function createDemoFaceDescriptor(): number[] {
  const out: number[] = [];
  for (let i = 0; i < 128; i++) {
    out.push(Math.sin(i * 0.17) * 0.02);
  }
  return out;
}
