import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Finance from "./pages/Finance";
import Marketing from "./pages/Marketing";
import RouteGuard from "./components/RouteGuard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth layout */}
          <Route
            path="/login"
            element={
              <RouteGuard type="auth">
                <AuthLayout />
              </RouteGuard>
            }
          >
            <Route index element={<Login />} />
          </Route>

          {/* Main layout */}
          <Route
            path="/"
            element={
              <RouteGuard type="protected">
                <MainLayout />
              </RouteGuard>
            }
          >
            <Route index element={<Home />} />
            <Route path="/reports">
              <Route path="finance" element={<Finance />} />
              <Route path="marketing" element={<Marketing />} />
            </Route>
            <Route path="/students" element={<Students />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
