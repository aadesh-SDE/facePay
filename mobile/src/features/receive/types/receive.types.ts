export interface QRData {
  userId: string;
  name: string;
  mobile: string;
}

export interface ReceiveState {
  qrData: QRData | null;
  loading: boolean;
  error: string | null;
}
