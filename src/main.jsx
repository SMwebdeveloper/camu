import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import {Toaster} from "react-hot-toast"

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <Toaster position="top-right" reverseOrder={false}/>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
