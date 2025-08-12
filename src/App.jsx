import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { PhoneInput } from "./components/auth/PhoneInput";
import { OTPVerify } from "./components/auth/OTPVerify";
import { FiSun, FiMoon } from "react-icons/fi";
import { useChatStore } from "./stores/chatStore";
import { useEffect } from "react";

const App = () => {
  const { token } = useAuthStore();
  const { darkMode, toggleDarkMode } = useChatStore();

   useEffect(() => {
    const root = document.documentElement;
    root.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <BrowserRouter>

           <button 
        className="dark-mode-toggle"
        onClick={toggleDarkMode}
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

        <Routes>
          <Route
            path="/"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<PhoneInput />} />
          <Route path="/verify" element={<OTPVerify />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={token ? <Chat /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
