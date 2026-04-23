export interface Recipient {
  id: string;
  name: string;
  mobile: string;
  avatar?: string;
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
  searchLoading: boolean;
  searchError: string | null;
  searchResults: Recipient[];
}

export interface TransferResponse {
  transactionId: string;
  amount: number;
  recipientId: string;
  timestamp: string;
  newBalance: number;
}
