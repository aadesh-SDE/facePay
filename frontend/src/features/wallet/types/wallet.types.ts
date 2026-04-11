export interface WalletState {
  balance: number;
  loading: boolean;
  error: string | null;
}

export interface AddFundsRequest {
  amount: number;
}

export interface AddFundsResult {
  newBalance: number;
  timestamp: string;
}
