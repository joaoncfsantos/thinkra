import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Layout from "./Layout.tsx";
import Header from "./Header.tsx";
import Content from "./Content.tsx";
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Header />
          <Content />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
