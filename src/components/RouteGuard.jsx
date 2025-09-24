import { Navigate } from "react-router-dom";

export default function RouteGuard({ children, type }) {
  const token = sessionStorage.getItem("accessToken");

  if (type === "protected" && !token) {
    // Faqat token bo‘lsa kiritadi
    return <Navigate to="/login" replace />;
  }

  if (type === "auth" && token) {
    // Agar token bo‘lsa, login sahifaga kiritmaydi
    return <Navigate to="/" replace />;
  }

  return children;
}
