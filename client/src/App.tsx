import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Layout from "./Layout.tsx";
import Header from "./Header.tsx";
import Content from "./Content.tsx";
import ResetPasswordPage from "./ResetPasswordPage.tsx";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Header />
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
