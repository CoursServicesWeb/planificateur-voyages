import { useState } from "react";

import "./App.css";
import DashAdminDestinations from "./pages/DashAdminDestinations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormModifierDestination from "./pages/FormModifierDestination";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/destinations" element={<DashAdminDestinations />} />
        <Route
          path="/admin/modifier-destination/:id"
          element={<FormModifierDestination />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
