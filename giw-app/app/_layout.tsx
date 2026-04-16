import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={false} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8f9fa" }}
        edges={["bottom"]}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#f8f9fa",
            },
          }}
        >
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(user)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(admin)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
      <Toast />
    </SafeAreaProvider>
  );
}
