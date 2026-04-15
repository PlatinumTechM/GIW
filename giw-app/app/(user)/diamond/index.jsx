// Entry point - redirects to natural diamonds by default
import { Redirect } from "expo-router";

export default function DiamondIndex() {
  return <Redirect href="/(user)/diamond/DiamondSearchScreen?type=natural" />;
}
