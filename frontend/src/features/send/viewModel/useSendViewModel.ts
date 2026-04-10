import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import type { Recipient } from "../types/send.types";
import {
  setRecipient,
  setAmount,
  setNote,
  setStatus,
  resetSend,
  clearSendError,
} from "../state/sendSlice";
import { submitTransferThunk } from "../state/sendThunks";

export function useSendViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const send = useSelector((state: RootState) => state.send);
  const balance = useSelector((state: RootState) => state.wallet.balance);

  const selectRecipient = useCallback(
    (recipient: Recipient) => dispatch(setRecipient(recipient)),
    [dispatch],
  );

  const updateAmount = useCallback(
    (amount: number) => dispatch(setAmount(amount)),
    [dispatch],
  );

  const updateNote = useCallback(
    (note: string) => dispatch(setNote(note)),
    [dispatch],
  );

  const updateStatus = useCallback(
    (status: Parameters<typeof setStatus>[0]) => dispatch(setStatus(status)),
    [dispatch],
  );

  const confirmTransfer = useCallback(
    () => {
      if (!send.recipient) return;
      return dispatch(
        submitTransferThunk({
          recipientId: send.recipient.id,
          amount: send.amount,
          note: send.note || undefined,
        }),
      );
    },
    [dispatch, send.recipient, send.amount, send.note],
  );

  const reset = useCallback(() => dispatch(resetSend()), [dispatch]);

  const clearError = useCallback(
    () => dispatch(clearSendError()),
    [dispatch],
  );

  return {
    ...send,
    balance,
    selectRecipient,
    updateAmount,
    updateNote,
    updateStatus,
    confirmTransfer,
    reset,
    clearError,
    fee: 0,
    total: send.amount,
  };
}
