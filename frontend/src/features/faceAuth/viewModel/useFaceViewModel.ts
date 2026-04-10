import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import type { VerifyStatus } from "../types/face.types";
import { registerFaceThunk, loadDescriptorThunk } from "../state/faceThunks";
import {
  setVerifyStatus,
  incrementBlinkCount,
  resetBlinkCount,
  incrementAttempts,
  resetVerification,
  resetAllFaceState,
  clearFaceError,
} from "../state/faceSlice";

export function useFaceViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const face = useSelector((state: RootState) => state.face);

  const registerFace = useCallback(
    (descriptor: number[]) => dispatch(registerFaceThunk(descriptor)),
    [dispatch],
  );

  const loadDescriptor = useCallback(
    () => dispatch(loadDescriptorThunk()),
    [dispatch],
  );

  const updateStatus = useCallback(
    (status: VerifyStatus) => dispatch(setVerifyStatus(status)),
    [dispatch],
  );

  const addBlink = useCallback(
    () => dispatch(incrementBlinkCount()),
    [dispatch],
  );

  const resetBlinks = useCallback(
    () => dispatch(resetBlinkCount()),
    [dispatch],
  );

  const addAttempt = useCallback(
    () => dispatch(incrementAttempts()),
    [dispatch],
  );

  const resetVerify = useCallback(
    () => dispatch(resetVerification()),
    [dispatch],
  );

  const resetAll = useCallback(
    () => dispatch(resetAllFaceState()),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearFaceError()),
    [dispatch],
  );

  return {
    ...face,
    registerFace,
    loadDescriptor,
    updateStatus,
    addBlink,
    resetBlinks,
    addAttempt,
    resetVerify,
    resetAll,
    clearError,
    isMaxAttempts: face.attempts >= face.maxAttempts,
  };
}
