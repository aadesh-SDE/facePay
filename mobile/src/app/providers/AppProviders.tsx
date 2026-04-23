import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontLoader } from "@/app/providers/FontLoader";
import { RootNavigator } from "@/app/navigation/RootNavigator";
import { persistor, store } from "@/app/store";
import { ThemeProvider } from "@/shared/theme";

export function AppProviders() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <FontLoader>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </FontLoader>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
