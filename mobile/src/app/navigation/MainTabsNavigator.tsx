import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MainTabParamList, ReceiveStackParamList } from "@/app/navigation/types";
import { HistoryScreen } from "@/features/history/screens/HistoryScreen";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { MyQRScreen } from "@/features/receive/screens/MyQRScreen";
import { ScanQRScreen } from "@/features/receive/screens/ScanQRScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const ReceiveStack = createNativeStackNavigator<ReceiveStackParamList>();

function ReceiveStackNavigator() {
  return (
    <ReceiveStack.Navigator screenOptions={{ headerShown: true }}>
      <ReceiveStack.Screen
        name="ReceiveMyQR"
        component={MyQRScreen}
        options={{ title: "My QR" }}
      />
      <ReceiveStack.Screen
        name="ReceiveScan"
        component={ScanQRScreen}
        options={{ title: "Scan QR" }}
      />
    </ReceiveStack.Navigator>
  );
}

export function MainTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{ title: "History" }}
      />
      <Tab.Screen
        name="ReceiveTab"
        component={ReceiveStackNavigator}
        options={{ title: "Receive", headerShown: false }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
