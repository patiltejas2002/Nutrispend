import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import AppRouter from "../src/AppRouter";


function App() {
  return (
    
      <Theme accentColor="green" radius="large" scaling="95%">
        <AppRouter />
      </Theme>
  
  );
}

export default App;
