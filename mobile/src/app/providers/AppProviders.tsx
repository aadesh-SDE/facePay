import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FontLoader } from "@/app/providers/FontLoader";
import { RootNavigator } from "@/app/navigation/RootNavigator";
import { persistor, store } from "@/app/store";
import { bootstrapSessionThunk } from "@/features/auth/state/authThunks";
import { ThemeProvider, useTheme } from "@/shared/theme";

function BootstrapThenNavigate() {
  const dispatch = useAppDispatch();
  const bootstrapping = useAppSelector((s) => s.auth.bootstrapping);
  const { colors } = useTheme();

  useEffect(() => {
    void dispatch(bootstrapSessionThunk());
  }, [dispatch]);

  if (bootstrapping) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
        accessibilityLabel="Starting session"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export function AppProviders() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <FontLoader>
              <BootstrapThenNavigate />
            </FontLoader>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
