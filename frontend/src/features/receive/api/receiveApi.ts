import api from "@/shared/services/api";
import type { QRData } from "../types/receive.types";
import { getRecipientById } from "@/features/send/api/sendApi";

export async function generatePaymentQR(): Promise<QRData> {
  const { data } = await api.get<QRData>("/api/v1/me/receive-qr");
  return data;
}

export async function resolveQR(data: string): Promise<QRData> {
  let parsed: QRData;
  try {
    parsed = JSON.parse(data) as QRData;
  } catch {
    throw new Error("Could not read QR code. Please try again.");
  }
  if (!parsed?.userId) {
    throw new Error("Invalid QR data");
  }
  const verified = await getRecipientById(parsed.userId);
  return {
    userId: verified.id,
    name: verified.name,
    mobile: verified.mobile,
  };
}
