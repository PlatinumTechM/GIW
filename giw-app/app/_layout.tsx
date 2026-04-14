import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#ffffff",
            },
            headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
            headerTitleStyle: {
              fontWeight: "600",
              fontSize: 18,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#0a0a0a" : "#f8f9fa",
            },
          }}
        >
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
              headerStyle: {
                backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#ffffff",
              },
              headerTintColor: colorScheme === "dark" ? "#ffffff" : "#000000",
            }}
          />
        </Stack>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor="transparent"
          translucent={false}
        />
      </ThemeProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
