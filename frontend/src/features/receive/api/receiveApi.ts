import type { QRData } from "../types/receive.types";

const MOCK_DELAY = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generatePaymentQR(
  userId: string,
  name: string,
  mobile: string,
): Promise<QRData> {
  await delay(MOCK_DELAY);
  return { userId, name, mobile };
}

export async function resolveQR(data: string): Promise<QRData> {
  await delay(MOCK_DELAY);
  try {
    const parsed = JSON.parse(data) as QRData;
    if (!parsed.userId || !parsed.name || !parsed.mobile) {
      throw new Error("Invalid QR data");
    }
    return parsed;
  } catch {
    throw new Error("Could not read QR code. Please try again.");
  }
}
