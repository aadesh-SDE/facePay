import type {
  AddFundsRequest,
  AddFundsResult,
  TransferRequest,
  TransferResult,
} from "../types/wallet.types";

const MOCK_DELAY = 600;
const STORAGE_KEY = "fp_wallet_balance";
const INITIAL_BALANCE = 10_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStoredBalance(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseFloat(stored) : INITIAL_BALANCE;
}

function setStoredBalance(balance: number): void {
  localStorage.setItem(STORAGE_KEY, balance.toString());
}

export async function fetchBalance(): Promise<number> {
  await delay(MOCK_DELAY);
  return getStoredBalance();
}

export async function addFunds(req: AddFundsRequest): Promise<AddFundsResult> {
  await delay(MOCK_DELAY);
  const current = getStoredBalance();
  const newBalance = current + req.amount;
  setStoredBalance(newBalance);
  return {
    newBalance,
    timestamp: new Date().toISOString(),
  };
}

export async function submitTransfer(
  req: TransferRequest,
): Promise<TransferResult> {
  await delay(MOCK_DELAY);
  const current = getStoredBalance();

  if (req.amount > current) {
    throw new Error("Insufficient balance");
  }

  const newBalance = current - req.amount;
  setStoredBalance(newBalance);

  return {
    transactionId: `txn_${Date.now()}`,
    amount: req.amount,
    recipientId: req.recipientId,
    timestamp: new Date().toISOString(),
    newBalance,
  };
}
