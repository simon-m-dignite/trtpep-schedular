import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const supabase = createClient(
  "https://pfuhmovrjjtoxbzornfc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdWhtb3Zyamp0b3hiem9ybmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MTU2MTAsImV4cCI6MjA0MzI5MTYxMH0.Oq8-ad18DIooiDEMoWlRLrbyUwsPiUiovHWfcIbMN18"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
      </SessionContextProvider>
    </BrowserRouter>
  </StrictMode>
);
