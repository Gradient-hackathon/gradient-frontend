import { Link } from "react-router-dom";
import WalletButton from "./WalletButton";

export default function Navbar() {
  return (
    <nav className=" bg-primary px-10">
      <div className=" flex items-center justify-between h-16">
        <Link to="/">
          <div className="flex items-center  bg-pink-100 rounded-md px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#eab308" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="75%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path d="m12 3-8.85 3.93a1 1 0 0 0-.15 1.76l8.85 3.93a1 1 0 0 0 .3 0l8.85-3.93a1 1 0 0 0-.15-1.76L12 3z" />
              <path d="m20.85 9.07-8.85 3.93a1 1 0 0 1-.3 0l-8.85-3.93" />
              <path d="m3 16.5 8.85 3.93a1 1 0 0 0 .3 0L21 16.5" />
            </svg>
            <div className="ml-2 ">
              <span className="text-3xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Gradient
              </span>
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
