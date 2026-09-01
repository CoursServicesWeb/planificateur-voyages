import "./App.css";
import DashAdminDestinations from "./pages/DashAdminDestinations";
import FormModifierDestination from "./pages/FormModifierDestination";
import AccueilDestination from "./pages/AccueilDestination";
import Login from "./pages/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccueilDestination />} />

        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Pages administrateur */}
        <Route path="/admin" element={<DashAdminDestinations />} />

        <Route
          path="/admin/modifier-destination/:id"
          element={<FormModifierDestination />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;