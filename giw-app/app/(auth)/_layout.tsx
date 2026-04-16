import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        contentStyle: {
          backgroundColor: "#f8f9fa",
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          contentStyle: {
            backgroundColor: "#f8f9fa",
          },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          contentStyle: {
            backgroundColor: "#f8f9fa",
          },
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          contentStyle: {
            backgroundColor: "#f8f9fa",
          },
        }}
      />
    </Stack>
  );
}
