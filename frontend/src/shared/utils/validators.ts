export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ""));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Maximum single transfer in INR (rupees); must match backend and keypad caps. */
export const MAX_TRANSFER_RUPEES = 100_000;

export function isValidAmount(amount: number, balance: number): string | null {
  if (amount <= 0) return "Amount must be greater than zero";
  if (amount > balance) return "Insufficient balance";
  if (amount > MAX_TRANSFER_RUPEES)
    return "Maximum transfer limit is ₹1,00,000";
  return null;
}

export function isValidPassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function isValidName(name: string): string | null {
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
}
