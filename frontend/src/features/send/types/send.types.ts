export interface Recipient {
  id: string;
  name: string;
  mobile: string;
  avatar?: string;
}

export interface AmountEntry {
  value: string;
  numericValue: number;
}

export interface ReviewData {
  recipient: Recipient;
  amount: number;
  note: string;
  fee: number;
  total: number;
}

export type SendStatus =
  | "idle"
  | "selecting"
  | "entering_amount"
  | "reviewing"
  | "verifying"
  | "success"
  | "failed";

export interface SendState {
  recipient: Recipient | null;
  amount: number;
  note: string;
  status: SendStatus;
  transactionId: string | null;
  loading: boolean;
  error: string | null;
}

export interface TransferResponse {
  transactionId: string;
  amount: number;
  recipientId: string;
  timestamp: string;
  newBalance: number;
}
