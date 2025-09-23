import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Students from "./pages/Students";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth layout */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>

          {/* Main layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/students" element={<Students/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
