import { Text, View, Button } from "react-native";
import { loginApi } from "./src/api/client";

export default function App() {
  const testLogin = async () => {
    try {
      const res = await loginApi("test@test.com", "1234");
      console.log(res);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Text>Testing API On Android App</Text>
      <Button title="Test Login API On Android App" onPress={testLogin} />
    </View>
  );
}
