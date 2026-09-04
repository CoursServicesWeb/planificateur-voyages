
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Destinations from "./pages/destinations/Destinations";
import MesVoyages from "./pages/mesvoyages/MesVoyages";
import { AuthProvider } from "./context/AuthContext";
import { Authenticate } from './components/auth/Authenticate';


function App() {
 
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Destinations />}/>
          <Route path="/mesvoyages" element={<Authenticate><MesVoyages /></Authenticate>  }/>
        </Routes>
      </BrowserRouter>
    
  )
}

export default App