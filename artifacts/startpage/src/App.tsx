import { ThemeProvider } from "next-themes";
import { Startpage } from "@/components/startpage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Startpage />
    </ThemeProvider>
  );
}

export default App;
