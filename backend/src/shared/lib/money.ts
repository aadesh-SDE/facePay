/** Max single transfer in INR (rupees) — align with frontend validators. */
export const MAX_TRANSFER_RUPEES = 100_000;

export function rupeesToPaise(rupees: number): bigint {
  if (!Number.isFinite(rupees) || rupees <= 0) {
    throw new Error("INVALID_AMOUNT");
  }
  const scaled = Math.round(rupees * 100);
  if (Math.abs(rupees * 100 - scaled) > 1e-6) {
    throw new Error("TOO_MANY_DECIMALS");
  }
  if (rupees > MAX_TRANSFER_RUPEES) {
    throw new Error("AMOUNT_TOO_LARGE");
  }
  return BigInt(scaled);
}

export function paiseToRupees(paise: bigint): number {
  return Number(paise) / 100;
}

export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\s/g, "");
}
