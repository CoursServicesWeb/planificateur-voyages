import { useState } from "react";

import "./App.css";
import DashAdminDestinations from "./pages/DashAdminDestinations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormModifierDestination from "./pages/FormModifierDestination";
import AccueilDestination from "./pages/AccueilDestination";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccueilDestination />} />
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
