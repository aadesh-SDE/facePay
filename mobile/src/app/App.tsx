import { StatusBar } from "expo-status-bar";
import { AppProviders } from "@/app/providers/AppProviders";

export function App() {
  return (
    <>
      <AppProviders />
      <StatusBar style="dark" />
    </>
  );
}
