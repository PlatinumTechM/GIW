import AppNavigator from "./src/navigation/AppNavigator";
import Login from "./app/(auth)/login";

export default function App() {
  return (
    <>
      <Login />
      <AppNavigator />
    </>
  );
}
