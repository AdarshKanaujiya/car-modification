import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BuildProvider } from "./context/BuildContext";
import Home from "./pages/Home";
import Customize from "./pages/Customize";

function App() {
  return (
    <BuildProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </BrowserRouter>
    </BuildProvider>
  );
}

export default App;
