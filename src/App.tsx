import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import { WalletProvider } from "./contexts/WalletContext";
import Admin from "./pages/Admin";

function App() {
  return (
    <WalletProvider>
      <div>
        <Navbar />
        <main className="w-full px-10 pt-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
