import type { AppDispatch } from "./store";
import { setBalance } from "@/features/wallet/state/walletSlice";
import { resetHomeData } from "@/features/home/state/homeSlice";
import { resetHistoryData } from "@/features/history/state/historySlice";
import { resetReceiveData } from "@/features/receive/state/receiveSlice";
import { resetProfileData } from "@/features/profile/state/profileSlice";
import { resetSend } from "@/features/send/state/sendSlice";
import { resetAllFaceState } from "@/features/faceAuth/state/faceSlice";

/** Clear user-scoped UI state after logout or forced session end (401). */
export function resetSessionClientState(dispatch: AppDispatch): void {
  dispatch(setBalance(0));
  dispatch(resetHomeData());
  dispatch(resetHistoryData());
  dispatch(resetReceiveData());
  dispatch(resetProfileData());
  dispatch(resetSend());
  dispatch(resetAllFaceState());
}
