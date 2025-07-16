import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import { WalletProvider } from "./contexts/WalletContext";
import Admin from "./pages/Admin";
import Receiver from "./pages/Receiver";

function App() {
  return (
    <WalletProvider>
      <div>
        <Navbar />
        <main className="w-full px-10 pt-10">
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/receiver" element={<Receiver />} />
          </Routes>
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
