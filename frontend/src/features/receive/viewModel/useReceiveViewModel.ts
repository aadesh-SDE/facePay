import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { setQRData, setScanResult, clearScanResult } from "../state/receiveSlice";
import { generatePaymentQR, resolveQR } from "../api/receiveApi";

export function useReceiveViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const receive = useSelector((state: RootState) => state.receive);

  useEffect(() => {
    if (user && !receive.qrData) {
      generatePaymentQR(user.id, user.name, user.mobile).then((data) => {
        dispatch(setQRData(data));
      });
    }
  }, [user, receive.qrData, dispatch]);

  const handleScan = useCallback(
    async (data: string) => {
      try {
        const result = await resolveQR(data);
        dispatch(setScanResult({ success: true, data: result }));
      } catch (err) {
        dispatch(
          setScanResult({
            success: false,
            data: null,
            error: err instanceof Error ? err.message : "Scan failed",
          }),
        );
      }
    },
    [dispatch],
  );

  const resetScan = useCallback(
    () => dispatch(clearScanResult()),
    [dispatch],
  );

  return {
    ...receive,
    user,
    handleScan,
    resetScan,
    qrValue: receive.qrData ? JSON.stringify(receive.qrData) : "",
  };
}
