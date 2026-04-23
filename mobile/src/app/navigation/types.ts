import type { NavigatorScreenParams } from "@react-navigation/native";

export type ReceiveStackParamList = {
  ReceiveMyQR: undefined;
  ReceiveScan: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  ReceiveTab: NavigatorScreenParams<ReceiveStackParamList> | undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RegisterFace: undefined;
  FaceVerification: undefined;
  VerificationFailed: { message?: string } | undefined;
  SelectRecipient: undefined;
  EnterAmount: undefined;
  ReviewPayment: undefined;
  SuccessReceipt: { transactionId?: string } | undefined;
};
