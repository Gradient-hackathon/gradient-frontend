import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-pink-400">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m12 3-8.85 3.93a1 1 0 0 0-.15 1.76l8.85 3.93a1 1 0 0 0 .3 0l8.85-3.93a1 1 0 0 0-.15-1.76L12 3z" />
            <path d="m20.85 9.07-8.85 3.93a1 1 0 0 1-.3 0l-8.85-3.93" />
            <path d="m3 16.5 8.85 3.93a1 1 0 0 0 .3 0L21 16.5" />
          </svg>
          <span className="ml-2 text-lg font-bold">Gradient</span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" className="cursor-pointer">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
