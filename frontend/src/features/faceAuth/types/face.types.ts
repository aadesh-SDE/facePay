export type VerifyStatus =
  | "idle"
  | "loading_models"
  | "scanning"
  | "matched"
  | "blink_pending"
  | "success"
  | "failed";

export interface FaceState {
  registered: boolean;
  descriptor: number[] | null;
  verifyStatus: VerifyStatus;
  blinkCount: number;
  attempts: number;
  maxAttempts: number;
  error: string | null;
}

export interface SaveDescriptorRequest {
  userId: string;
  descriptor: number[];
}

export interface SaveDescriptorResponse {
  success: boolean;
}

export interface GetDescriptorResponse {
  descriptor: number[] | null;
}
