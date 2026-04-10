export interface QRData {
  userId: string;
  name: string;
  mobile: string;
}

export interface ScanResult {
  success: boolean;
  data: QRData | null;
  error?: string;
}

export interface ReceiveState {
  qrData: QRData | null;
  scanResult: ScanResult | null;
  loading: boolean;
  error: string | null;
}
