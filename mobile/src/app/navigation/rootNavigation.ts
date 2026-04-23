import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import type { RootStackParamList } from "@/app/navigation/types";

/** Walk up to the root navigator (e.g. app stack above tabs) and navigate. */
export function navigateRootStack<Name extends keyof RootStackParamList>(
  navigation: NavigationProp<ParamListBase>,
  name: Name,
  params?: RootStackParamList[Name],
): void {
  let current: NavigationProp<ParamListBase> = navigation;
  while (current.getParent?.()) {
    current = current.getParent()!;
  }
  current.navigate(name as string, params as never);
}
