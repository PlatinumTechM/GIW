import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#f8f9fa" }}
        edges={["bottom"]}
      >
        <StatusBar style="inverted" backgroundColor="#f8f9fa" />

        <Stack
          screenOptions={{
            headerShown: false,
            // contentStyle: {
            //   backgroundColor: "#f8f9fa",
            // },
          }}
        >
          <Stack.Screen
            name="(user)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
