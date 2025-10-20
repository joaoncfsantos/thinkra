import { ThemeProvider } from "./components/theme-provider.tsx";
import Layout from "./Layout.tsx";
import Header from "./Header.tsx";
import Content from "./Content.tsx";
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Content />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
