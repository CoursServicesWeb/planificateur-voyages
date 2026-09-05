import "./App.css";
import DashAdminDestinations from "./pages/DashAdminDestinations";
import FormModifierDestination from "./pages/FormModifierDestination";
import AccueilDestination from "./pages/AccueilDestination";
import Login from "./pages/login";
import AvisPage from "./pages/avis";
import Register from "./pages/register";
import MesVoyages from "./pages/MesVoyages";
import { Authenticate } from "./components/auth/Authenticate";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AccueilDestination />} />

        <Route path="/login" element={<Login />} />

        <Route path="/avis" element={<AvisPage />} />

        <Route path="/register" element={<Register />} />

        <Route path="/mes-voyages" element={<Authenticate><MesVoyages /></Authenticate>}/>

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