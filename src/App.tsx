import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import AppRouter from "../src/AppRouter";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Theme accentColor="green" radius="large" scaling="95%">
        <AppRouter />
      </Theme>
    </AuthProvider>
  );
}

export default App;
