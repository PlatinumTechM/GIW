import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#0a0a0a" : "#f8f9fa",
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#0a0a0a" : "#f8f9fa",
          },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#0a0a0a" : "#f8f9fa",
          },
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#0a0a0a" : "#f8f9fa",
          },
        }}
      />
    </Stack>
  );
}
