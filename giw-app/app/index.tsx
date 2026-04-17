import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function Index() {
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const t: any = await SecureStore.getItemAsync("token");
      setToken(t);
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return null;

  if (token) {
    return <Redirect href="/(user)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
