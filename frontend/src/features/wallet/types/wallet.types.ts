export interface WalletState {
  balance: number;
  loading: boolean;
  error: string | null;
}

export interface TransferRequest {
  recipientId: string;
  amount: number;
  note?: string;
}

export interface TransferResult {
  transactionId: string;
  amount: number;
  recipientId: string;
  timestamp: string;
  newBalance: number;
}

export interface AddFundsRequest {
  amount: number;
}

export interface AddFundsResult {
  newBalance: number;
  timestamp: string;
}
