import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Question from "./pages/Question";
import Result from "./pages/Result";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/practice"
          element={<ProtectedRoute><Practice /></ProtectedRoute>}
        />
        <Route
          path="/question"
          element={<ProtectedRoute><Question /></ProtectedRoute>}
        />
        <Route
          path="/result"
          element={<ProtectedRoute><Result /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

